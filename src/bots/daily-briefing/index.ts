import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import cron from 'node-cron';
import { getTodayEvents, getEventsForDate } from './services/calendar.js';
import { getTodayTasks, getWeekTasks } from './services/notion.js';
import { getYesterdaySummary } from './services/timetracker.js';
import {
  generateManualBriefingMessage,
  generateTomorrowMessage,
  generateTodayTasksMessage,
  generateWeekTasksMessage,
  generateWorkSummaryMessage,
  generateFullBriefingMessage,
} from './utils/format.js';

// 環境変数を読み込む
config();

// 環境変数の検証
const botToken = process.env.SLACK_BOT_TOKEN;
const appToken = process.env.SLACK_APP_TOKEN;
const channelId = process.env.BRIEFING_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
const briefingTime = process.env.BRIEFING_TIME || '08:00';
const weekdaysOnly = process.env.BRIEFING_WEEKDAYS_ONLY !== 'false';

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
  const cleanedText = text.replace(/<@[A-Z0-9]+>/g, '').trim();
  const match = cleanedText.match(/^\/?(\w+)\s*(.*)/);
  if (!match) return { command: '', args: '' };
  return { command: match[1].toLowerCase(), args: match[2].trim() };
}

// 平日かどうかをチェック
function isWeekday(): boolean {
  const day = new Date().getDay();
  return day !== 0 && day !== 6;
}

// ブリーフィングを送信（拡張版：カレンダー + タスク + 前日サマリー）
async function sendBriefing() {
  if (!channelId) {
    console.error('❌ BRIEFING_CHANNEL_ID または SLACK_CHANNEL_ID が設定されていません');
    return;
  }

  // 平日のみの設定で、今日が休日の場合はスキップ
  if (weekdaysOnly && !isWeekday()) {
    console.log('📅 今日は休日のためブリーフィングをスキップします');
    return;
  }

  console.log('📊 ブリーフィングを生成中...');

  try {
    // 並列でデータを取得
    const [events, todayTasks, weekTasks, yesterdaySummary] = await Promise.all([
      getTodayEvents().catch(() => []),
      getTodayTasks().catch(() => []),
      getWeekTasks().catch(() => []),
      getYesterdaySummary().catch(() => []),
    ]);

    const message = generateFullBriefingMessage(events, todayTasks, weekTasks, yesterdaySummary);

    await app.client.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('✅ ブリーフィングを送信しました');
  } catch (error) {
    console.error('❌ ブリーフィング送信エラー:', error);

    // エラー通知を送信
    await app.client.chat.postMessage({
      channel: channelId,
      text: '⚠️ ブリーフィングの生成に失敗しました\n\n設定を確認してください。',
    });
  }
}

// app_mention イベントハンドラー
app.event('app_mention', async ({ event, say }) => {
  const { text } = event;

  console.log(`📥 受信テキスト: "${text}"`);

  const { command } = parseCommand(text);

  console.log(`📨 コマンド受信: /${command}`);

  try {
    switch (command) {
      case 'briefing':
        await handleFullBriefingCommand(say);
        break;
      case 'today':
        await handleBriefingCommand(say);
        break;
      case 'tomorrow':
        await handleTomorrowCommand(say);
        break;
      case 'tasks':
        await handleTasksCommand(say);
        break;
      case 'weektasks':
        await handleWeekTasksCommand(say);
        break;
      case 'yesterday':
        await handleYesterdayCommand(say);
        break;
      case 'help':
        await say('❓ 使用可能なコマンド:\n• `briefing` - フルブリーフィング\n• `today` - 今日の予定\n• `tomorrow` - 明日の予定\n• `tasks` - 今日のタスク\n• `weektasks` - 今週のタスク\n• `yesterday` - 昨日の作業');
        break;
      default:
        await say('❓ 使用可能なコマンド:\n• `briefing` - フルブリーフィング\n• `today` - 今日の予定\n• `tomorrow` - 明日の予定\n• `tasks` - 今日のタスク\n• `weektasks` - 今週のタスク\n• `yesterday` - 昨日の作業');
    }
  } catch (error) {
    console.error('エラー:', error);
    await say('❌ エラーが発生しました。もう一度お試しください。');
  }
});

// /briefing コマンド - 今日の予定を表示
async function handleBriefingCommand(say: (message: string) => Promise<unknown>) {
  try {
    const events = await getTodayEvents();
    const message = generateManualBriefingMessage(events);
    await say(message);
  } catch (error) {
    console.error('ブリーフィングエラー:', error);
    await say('❌ カレンダーの取得に失敗しました\n\n設定を確認してください。');
  }
}

// フルブリーフィングコマンド（カレンダー + タスク + 前日サマリー）
async function handleFullBriefingCommand(say: (message: string) => Promise<unknown>) {
  try {
    const [events, todayTasks, weekTasks, yesterdaySummary] = await Promise.all([
      getTodayEvents().catch(() => []),
      getTodayTasks().catch(() => []),
      getWeekTasks().catch(() => []),
      getYesterdaySummary().catch(() => []),
    ]);

    const message = generateFullBriefingMessage(events, todayTasks, weekTasks, yesterdaySummary);
    await say(message);
  } catch (error) {
    console.error('フルブリーフィングエラー:', error);
    await say('❌ ブリーフィングの取得に失敗しました\n\n設定を確認してください。');
  }
}

// /tomorrow コマンド - 明日の予定を表示
async function handleTomorrowCommand(say: (message: string) => Promise<unknown>) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const events = await getEventsForDate(tomorrow);
    const message = generateTomorrowMessage(events);
    await say(message);
  } catch (error) {
    console.error('明日の予定取得エラー:', error);
    await say('❌ 明日の予定の取得に失敗しました\n\n設定を確認してください。');
  }
}

// /tasks コマンド - 今日のタスクを表示
async function handleTasksCommand(say: (message: string) => Promise<unknown>) {
  try {
    const tasks = await getTodayTasks();
    const message = generateTodayTasksMessage(tasks);
    await say(message);
  } catch (error) {
    console.error('タスク取得エラー:', error);
    await say('❌ タスクの取得に失敗しました\n\nNotion設定を確認してください。');
  }
}

// /weektasks コマンド - 今週のタスクを表示
async function handleWeekTasksCommand(say: (message: string) => Promise<unknown>) {
  try {
    const tasks = await getWeekTasks();
    const message = generateWeekTasksMessage(tasks);
    await say(message);
  } catch (error) {
    console.error('週間タスク取得エラー:', error);
    await say('❌ 週間タスクの取得に失敗しました\n\nNotion設定を確認してください。');
  }
}

// /yesterday コマンド - 昨日の作業サマリーを表示
async function handleYesterdayCommand(say: (message: string) => Promise<unknown>) {
  try {
    const summary = await getYesterdaySummary();
    const message = generateWorkSummaryMessage(summary, '昨日');
    await say(message);
  } catch (error) {
    console.error('昨日の作業取得エラー:', error);
    await say('❌ 昨日の作業の取得に失敗しました');
  }
}

// cronの時刻をパース
function parseCronTime(time: string): { hour: string; minute: string } {
  const [hour, minute] = time.split(':');
  return { hour: hour || '8', minute: minute || '0' };
}

// アプリを起動
async function start() {
  try {
    await app.start();
    console.log('⚡ Daily Briefing Bot が起動しました');
    console.log(`📢 チャンネルID: ${channelId || '未設定'}`);
    console.log(`⏰ ブリーフィング時刻: ${briefingTime}`);
    console.log(`📅 平日のみ: ${weekdaysOnly}`);

    // 毎朝のブリーフィング用cronジョブを設定
    const { hour, minute } = parseCronTime(briefingTime);
    const cronExpression = `${minute} ${hour} * * *`;

    cron.schedule(cronExpression, async () => {
      console.log(`🕐 ブリーフィング時刻です (${briefingTime})`);
      await sendBriefing();
    }, {
      timezone: 'Asia/Tokyo'
    });

    console.log(`📆 ブリーフィングスケジューラーを開始しました（毎日 ${briefingTime}）`);
  } catch (error) {
    console.error('❌ 起動エラー:', error);
    process.exit(1);
  }
}

start();
