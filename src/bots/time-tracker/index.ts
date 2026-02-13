import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import cron from 'node-cron';
import {
  getProjectByName,
  getActiveProjects,
  getActiveSession,
  startWork,
  endWork,
  getTodayTotalMinutes,
  getTodaySummary,
  addWorkTime,
  getMonthlySummary,
  getWeeklySummary,
  deleteLastTimeLog,
  addProject,
} from './services/supabase.js';
import { formatDuration, formatTime } from './utils/format.js';

// 環境変数を読み込む
config();

// 環境変数の検証
const botToken = process.env.SLACK_BOT_TOKEN;
const appToken = process.env.SLACK_APP_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

if (!botToken || !appToken) {
  console.error('❌ SLACK_BOT_TOKEN または SLACK_APP_TOKEN が設定されていません');
  process.exit(1);
}

// Slack Appを初期化（Socket Mode）
const app = new App({
  token: botToken,
  appToken: appToken,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

// コマンドパーサー
function parseCommand(text: string): { command: string; args: string } {
  // メンション部分 (<@XXXXX>) を除去
  const cleanedText = text.replace(/<@[A-Z0-9]+>/g, '').trim();
  const match = cleanedText.match(/^\/?(\w+)\s*(.*)/);
  if (!match) return { command: '', args: '' };
  return { command: match[1].toLowerCase(), args: match[2].trim() };
}

// app_mention イベントハンドラー
app.event('app_mention', async ({ event, say }) => {
  const { text } = event;

  console.log(`📥 受信テキスト: "${text}"`);

  const { command, args } = parseCommand(text);

  console.log(`📨 コマンド受信: /${command} ${args}`);

  try {
    switch (command) {
      case 'in':
        await handleInCommand(args, say);
        break;
      case 'out':
        await handleOutCommand(say);
        break;
      case 'status':
        await handleStatusCommand(say);
        break;
      case 'add':
        await handleAddCommand(args, say);
        break;
      case 'summary':
        await handleSummaryCommand(args, say);
        break;
      case 'today':
        await handleTodayCommand(say);
        break;
      case 'week':
        await handleWeekCommand(say);
        break;
      case 'undo':
        await handleUndoCommand(say);
        break;
      case 'project':
        await handleProjectCommand(args, say);
        break;
      default:
        await say('❓ 使用可能なコマンド:\n• `in [プロジェクト名]` - 作業開始\n• `out` - 作業終了\n• `status` - 状態確認\n• `today` - 今日の内訳\n• `week` - 週間サマリー\n• `add [プロジェクト名] [時間]` - 作業時間追加\n• `undo` - 直近の記録を削除\n• `summary [YYYY-MM]` - 月間サマリー\n• `project add [名前] [時給]` - プロジェクト追加');
    }
  } catch (error) {
    console.error('エラー:', error);
    await say('❌ エラーが発生しました。もう一度お試しください。');
  }
});

// /in コマンド - 作業開始
async function handleInCommand(projectName: string, say: (message: string) => Promise<unknown>) {
  // プロジェクト名が指定されていない場合
  if (!projectName) {
    const projects = await getActiveProjects();
    const projectList = projects.map((p) => p.name).join(', ');
    await say(`⚠️ プロジェクト名を指定してください\n登録済みプロジェクト: ${projectList || 'なし'}`);
    return;
  }

  // 既に作業中かチェック
  const activeSession = await getActiveSession();
  if (activeSession) {
    await say(
      `⚠️ 現在「${activeSession.project_name}」で作業中です\n先に \`out\` で終了してください`
    );
    return;
  }

  // プロジェクトを検索
  const project = await getProjectByName(projectName);
  if (!project) {
    const projects = await getActiveProjects();
    const projectList = projects.map((p) => p.name).join(', ');
    await say(`❌ プロジェクト「${projectName}」が見つかりません\n登録済みプロジェクト: ${projectList || 'なし'}`);
    return;
  }

  // 作業開始
  const timeLog = await startWork(project.id);
  if (!timeLog) {
    await say('❌ 作業開始に失敗しました');
    return;
  }

  const startTime = formatTime(timeLog.started_at);
  await say(
    `✅ 作業を開始しました\n📁 プロジェクト: ${project.name}\n🕐 開始時刻: ${startTime}`
  );
}

// /out コマンド - 作業終了
async function handleOutCommand(say: (message: string) => Promise<unknown>) {
  // 作業中のセッションを取得
  const activeSession = await getActiveSession();
  if (!activeSession) {
    await say('⚠️ 現在作業中ではありません\n`in [プロジェクト名]` で開始してください');
    return;
  }

  // 作業終了
  const timeLog = await endWork(activeSession.id);
  if (!timeLog || timeLog.duration_minutes === null || timeLog.duration_minutes === undefined) {
    await say('❌ 作業終了に失敗しました');
    return;
  }

  // 今日の合計を取得（endWork後なので今回の作業時間は既に含まれている）
  const todayTotal = await getTodayTotalMinutes();

  const endTime = formatTime(timeLog.ended_at!);
  const duration = formatDuration(timeLog.duration_minutes);
  const todayTotalFormatted = formatDuration(todayTotal);

  await say(
    `✅ 作業を終了しました\n📁 プロジェクト: ${activeSession.project_name}\n🕐 終了時刻: ${endTime}\n⏱️ 今回の作業時間: ${duration}\n📊 本日の合計: ${todayTotalFormatted}`
  );
}

// /status コマンド - 状態確認
async function handleStatusCommand(say: (message: string) => Promise<unknown>) {
  const activeSession = await getActiveSession();

  if (activeSession) {
    const startTime = formatTime(activeSession.started_at);
    const elapsed = formatDuration(activeSession.elapsed_minutes);
    await say(
      `🔵 作業中\n📁 プロジェクト: ${activeSession.project_name}\n🕐 開始時刻: ${startTime}\n⏱️ 経過時間: ${elapsed}`
    );
  } else {
    const todayTotal = await getTodayTotalMinutes();
    const todayTotalFormatted = formatDuration(todayTotal);
    await say(`⚪ 作業していません\n📊 本日の合計: ${todayTotalFormatted}`);
  }
}

// 時間文字列をパース（分に変換）
// 対応フォーマット: "2時間", "30分", "2時間30分", "2h", "30m", "2h30m", "1.5時間", "90"（分として解釈）
function parseTimeString(timeStr: string): number | null {
  const str = timeStr.trim();

  // 日本語フォーマット: "2時間30分", "2時間", "30分"
  const jpMatch = str.match(/^(\d+(?:\.\d+)?)\s*時間?\s*(?:(\d+)\s*分)?$/);
  if (jpMatch) {
    const hours = parseFloat(jpMatch[1]);
    const minutes = jpMatch[2] ? parseInt(jpMatch[2], 10) : 0;
    return Math.round(hours * 60 + minutes);
  }

  // 日本語フォーマット（分のみ）: "30分"
  const jpMinMatch = str.match(/^(\d+)\s*分$/);
  if (jpMinMatch) {
    return parseInt(jpMinMatch[1], 10);
  }

  // 英語フォーマット: "2h30m", "2h", "30m"
  const enMatch = str.match(/^(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+)\s*m)?$/i);
  if (enMatch && (enMatch[1] || enMatch[2])) {
    const hours = enMatch[1] ? parseFloat(enMatch[1]) : 0;
    const minutes = enMatch[2] ? parseInt(enMatch[2], 10) : 0;
    return Math.round(hours * 60 + minutes);
  }

  // 数字のみ: 分として解釈
  const numMatch = str.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) {
    return Math.round(parseFloat(numMatch[1]));
  }

  return null;
}

// /add コマンド - 作業時間追加
async function handleAddCommand(args: string, say: (message: string) => Promise<unknown>) {
  // 引数をパース: "プロジェクト名 時間" または "プロジェクト名 時間 メモ"
  const parts = args.split(/\s+/);

  if (parts.length < 2) {
    await say(
      '⚠️ 使用方法: `add [プロジェクト名] [時間]`\n' +
      '例: `add saixaid 2時間`\n' +
      '時間の形式: `2時間`, `30分`, `2時間30分`, `2h`, `30m`, `2h30m`, `90`(分)'
    );
    return;
  }

  const projectName = parts[0];
  const timeStr = parts[1];
  const note = parts.slice(2).join(' ') || undefined;

  // 時間をパース
  const durationMinutes = parseTimeString(timeStr);
  if (durationMinutes === null || durationMinutes <= 0) {
    await say(
      `❌ 時間の形式が正しくありません: 「${timeStr}」\n` +
      '使用可能な形式: `2時間`, `30分`, `2時間30分`, `2h`, `30m`, `2h30m`, `90`(分)'
    );
    return;
  }

  // プロジェクトを検索
  const project = await getProjectByName(projectName);
  if (!project) {
    const projects = await getActiveProjects();
    const projectList = projects.map((p) => p.name).join(', ');
    await say(`❌ プロジェクト「${projectName}」が見つかりません\n登録済みプロジェクト: ${projectList || 'なし'}`);
    return;
  }

  // 作業時間を追加
  const timeLog = await addWorkTime(project.id, durationMinutes, note);
  if (!timeLog) {
    await say('❌ 作業時間の追加に失敗しました');
    return;
  }

  // 今日の合計を取得
  const todayTotal = await getTodayTotalMinutes();
  const duration = formatDuration(durationMinutes);
  const todayTotalFormatted = formatDuration(todayTotal);

  let message = `✅ 作業時間を追加しました\n📁 プロジェクト: ${project.name}\n⏱️ 追加時間: ${duration}\n📊 本日の合計: ${todayTotalFormatted}`;
  if (note) {
    message += `\n📝 メモ: ${note}`;
  }

  await say(message);
}

// 金額をフォーマット
function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

// 月末判定
function isLastDayOfMonth(date: Date): boolean {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getMonth() !== tomorrow.getMonth();
}

// 月間サマリーを送信
async function sendMonthlySummary() {
  if (!channelId) {
    console.error('❌ SLACK_CHANNEL_ID が設定されていません');
    return;
  }

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const displayMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  console.log(`📊 ${displayMonth}の月間サマリーを生成中...`);

  const summaries = await getMonthlySummary(yearMonth);

  if (summaries.length === 0) {
    await app.client.chat.postMessage({
      channel: channelId,
      text: `📅 本日は締め日です\n\n⚠️ ${displayMonth}の作業データがありません`,
    });
    return;
  }

  // サマリーメッセージを構築
  let message = `📅 本日は締め日です\n\n【${displayMonth}の作業サマリー】\n\n`;

  let totalMinutes = 0;
  let totalAmount = 0;

  for (const summary of summaries) {
    const hours = formatDuration(summary.total_minutes);
    message += `📁 ${summary.project_name}（${summary.client_name}）\n`;
    message += `   ⏱️ 合計: ${hours}\n`;
    message += `   💰 請求額: ${formatCurrency(summary.total_amount)}\n\n`;

    totalMinutes += summary.total_minutes;
    totalAmount += summary.total_amount;
  }

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `⏱️ 総作業時間: ${formatDuration(totalMinutes)}\n`;
  message += `💰 総合計: ${formatCurrency(totalAmount)}`;

  await app.client.chat.postMessage({
    channel: channelId,
    text: message,
  });

  console.log(`✅ ${displayMonth}の月間サマリーを送信しました`);
}

// /summary コマンド - 月間サマリー手動取得
async function handleSummaryCommand(args: string, say: (message: string) => Promise<unknown>) {
  // 引数がなければ今月
  let yearMonth: string;
  let displayMonth: string;

  if (args) {
    // YYYY-MM 形式をチェック
    const match = args.match(/^(\d{4})-(\d{2})$/);
    if (!match) {
      await say('⚠️ 月の形式が正しくありません\n使用方法: `summary` または `summary 2026-01`');
      return;
    }
    yearMonth = args;
    displayMonth = `${match[1]}年${parseInt(match[2])}月`;
  } else {
    const now = new Date();
    yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    displayMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  }

  const summaries = await getMonthlySummary(yearMonth);

  if (summaries.length === 0) {
    await say(`📊 ${displayMonth}の作業データがありません`);
    return;
  }

  let message = `📊 【${displayMonth}の作業サマリー】\n\n`;

  let totalMinutes = 0;
  let totalAmount = 0;

  for (const summary of summaries) {
    const hours = formatDuration(summary.total_minutes);
    message += `📁 ${summary.project_name}（${summary.client_name}）\n`;
    message += `   ⏱️ 合計: ${hours}（${summary.session_count}回）\n`;
    message += `   💰 請求額: ${formatCurrency(summary.total_amount)}\n\n`;

    totalMinutes += summary.total_minutes;
    totalAmount += summary.total_amount;
  }

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `⏱️ 総作業時間: ${formatDuration(totalMinutes)}\n`;
  message += `💰 総合計: ${formatCurrency(totalAmount)}`;

  await say(message);
}

// /today コマンド - 今日のプロジェクト別内訳
async function handleTodayCommand(say: (message: string) => Promise<unknown>) {
  const summaries = await getTodaySummary();

  if (summaries.length === 0) {
    await say('📊 今日の作業データがありません');
    return;
  }

  let message = '📊 【今日の作業内訳】\n\n';
  let totalMinutes = 0;

  for (const summary of summaries) {
    const duration = formatDuration(summary.total_minutes);
    message += `📁 ${summary.project_name}: ${duration}\n`;
    totalMinutes += summary.total_minutes;
  }

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `⏱️ 合計: ${formatDuration(totalMinutes)}`;

  await say(message);
}

// /week コマンド - 週間サマリー
async function handleWeekCommand(say: (message: string) => Promise<unknown>) {
  const summaries = await getWeeklySummary();

  if (summaries.length === 0) {
    await say('📊 今週の作業データがありません');
    return;
  }

  let message = '📊 【今週の作業サマリー】\n\n';
  let totalMinutes = 0;

  for (const summary of summaries) {
    const duration = formatDuration(summary.total_minutes);
    message += `📁 ${summary.project_name}: ${duration}（${summary.session_count}回）\n`;
    totalMinutes += summary.total_minutes;
  }

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `⏱️ 合計: ${formatDuration(totalMinutes)}`;

  await say(message);
}

// /undo コマンド - 直近の記録を削除
async function handleUndoCommand(say: (message: string) => Promise<unknown>) {
  const deletedLog = await deleteLastTimeLog();

  if (!deletedLog) {
    await say('⚠️ 削除できる記録がありません');
    return;
  }

  const project = (deletedLog as unknown as { projects: { name: string } }).projects;
  const duration = formatDuration(deletedLog.duration_minutes || 0);

  await say(
    `🗑️ 直近の記録を削除しました\n📁 プロジェクト: ${project.name}\n⏱️ 削除した時間: ${duration}`
  );
}

// /project コマンド - プロジェクト管理
async function handleProjectCommand(args: string, say: (message: string) => Promise<unknown>) {
  const parts = args.split(/\s+/);
  const subCommand = parts[0]?.toLowerCase();

  if (subCommand === 'add') {
    // /project add [名前] [時給] [クライアント名(任意)]
    if (parts.length < 3) {
      await say('⚠️ 使用方法: `project add [名前] [時給]`\n例: `project add newproject 3000`');
      return;
    }

    const name = parts[1];
    const hourlyRate = parseInt(parts[2], 10);
    const clientName = parts[3] || undefined;

    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      await say('❌ 時給は正の数値で指定してください');
      return;
    }

    // 既存プロジェクトチェック
    const existing = await getProjectByName(name);
    if (existing) {
      await say(`❌ プロジェクト「${name}」は既に存在します`);
      return;
    }

    const project = await addProject(name, hourlyRate, clientName);
    if (!project) {
      await say('❌ プロジェクトの追加に失敗しました');
      return;
    }

    await say(
      `✅ プロジェクトを追加しました\n📁 名前: ${project.name}\n💰 時給: ${formatCurrency(project.hourly_rate)}\n🏢 クライアント: ${project.client_name}`
    );
  } else if (subCommand === 'list' || !subCommand) {
    // /project list または /project - プロジェクト一覧
    const projects = await getActiveProjects();

    if (projects.length === 0) {
      await say('📁 登録されているプロジェクトがありません');
      return;
    }

    let message = '📁 【プロジェクト一覧】\n\n';
    for (const p of projects) {
      message += `• ${p.name}（${p.client_name}）- ${formatCurrency(p.hourly_rate)}/h\n`;
    }

    await say(message);
  } else {
    await say('⚠️ 使用方法:\n• `project` - 一覧表示\n• `project add [名前] [時給]` - 追加');
  }
}

// アプリを起動
async function start() {
  try {
    await app.start();
    console.log('⚡ Time Tracker Bot が起動しました');
    console.log(`📢 チャンネルID: ${channelId || '未設定'}`);

    // 月末チェック用のcronジョブを設定（毎日23:00に実行）
    cron.schedule('0 23 * * *', async () => {
      console.log('🕐 月末チェック実行中...');
      const today = new Date();
      if (isLastDayOfMonth(today)) {
        console.log('📅 今日は月末です！サマリーを送信します');
        await sendMonthlySummary();
      } else {
        console.log('📅 今日は月末ではありません');
      }
    }, {
      timezone: 'Asia/Tokyo'
    });

    console.log('📆 月末通知スケジューラーを開始しました（毎日23:00にチェック）');
  } catch (error) {
    console.error('❌ 起動エラー:', error);
    process.exit(1);
  }
}

start();
