import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import {
  getProjectByName,
  getActiveProjects,
  getActiveSession,
  startWork,
  endWork,
  getTodayTotalMinutes,
  addWorkTime,
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
      default:
        await say('❓ 使用可能なコマンド:\n• `/in [プロジェクト名]` - 作業開始\n• `/out` - 作業終了\n• `/status` - 状態確認\n• `/add [プロジェクト名] [時間]` - 作業時間追加');
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
      `⚠️ 現在「${activeSession.project_name}」で作業中です\n先に \`/out\` で終了してください`
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
    await say('⚠️ 現在作業中ではありません\n`/in [プロジェクト名]` で開始してください');
    return;
  }

  // 作業終了
  const timeLog = await endWork(activeSession.id);
  if (!timeLog || timeLog.duration_minutes === null || timeLog.duration_minutes === undefined) {
    await say('❌ 作業終了に失敗しました');
    return;
  }

  // 今日の合計を取得
  const todayTotal = await getTodayTotalMinutes();
  const totalWithCurrent = todayTotal + timeLog.duration_minutes;

  const endTime = formatTime(timeLog.ended_at!);
  const duration = formatDuration(timeLog.duration_minutes);
  const todayTotalFormatted = formatDuration(totalWithCurrent);

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
      '⚠️ 使用方法: `/add [プロジェクト名] [時間]`\n' +
      '例: `/add saixaid 2時間`\n' +
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

// アプリを起動
async function start() {
  try {
    await app.start();
    console.log('⚡ Time Tracker Bot が起動しました');
    console.log(`📢 チャンネルID: ${channelId || '未設定'}`);
  } catch (error) {
    console.error('❌ 起動エラー:', error);
    process.exit(1);
  }
}

start();
