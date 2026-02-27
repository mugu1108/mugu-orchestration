import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import cron from 'node-cron';
import { getTodayEvents, getEventsForDate } from './services/calendar.js';
import { getYesterdaySummary } from './services/timetracker.js';
import {
  generateManualBriefingMessage,
  generateTomorrowMessage,
  generateWorkSummaryMessage,
  generateMorningBriefingMessage,
  generateEveningCheckMessage,
} from './utils/format.js';

// 環境変数を読み込む
config();

// 環境変数の検証
const botToken = process.env.SLACK_BOT_TOKEN;
const appToken = process.env.SLACK_APP_TOKEN;
const channelId = process.env.BRIEFING_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
const briefingTime = process.env.BRIEFING_TIME || '08:00';
const eveningTime = process.env.BRIEFING_EVENING_TIME || '18:00';
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

// 朝のブリーフィングを送信（Google Calendarのみ）
async function sendMorningBriefing() {
  if (!channelId) {
    console.error('❌ BRIEFING_CHANNEL_ID または SLACK_CHANNEL_ID が設定されていません');
    return;
  }

  // 平日のみの設定で、今日が休日の場合はスキップ
  if (weekdaysOnly && !isWeekday()) {
    console.log('📅 今日は休日のため朝のブリーフィングをスキップします');
    return;
  }

  console.log('☀️ 朝のブリーフィングを生成中...');

  try {
    const events = await getTodayEvents().catch(() => []);
    const message = generateMorningBriefingMessage(events);

    await app.client.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('✅ 朝のブリーフィングを送信しました');
  } catch (error) {
    console.error('❌ 朝のブリーフィング送信エラー:', error);

    await app.client.chat.postMessage({
      channel: channelId,
      text: '⚠️ 朝のブリーフィングの生成に失敗しました\n\n設定を確認してください。',
    });
  }
}

// 夕方チェックを送信
async function sendEveningCheck() {
  if (!channelId) {
    console.error('❌ BRIEFING_CHANNEL_ID または SLACK_CHANNEL_ID が設定されていません');
    return;
  }

  // 平日のみの設定で、今日が休日の場合はスキップ
  if (weekdaysOnly && !isWeekday()) {
    console.log('📅 今日は休日のため夕方チェックをスキップします');
    return;
  }

  console.log('🌆 夕方チェックを生成中...');

  try {
    // 今日の予定と明日の予定を取得
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayEvents, tomorrowEvents] = await Promise.all([
      getTodayEvents().catch(() => []),
      getEventsForDate(tomorrow).catch(() => []),
    ]);

    const message = generateEveningCheckMessage(todayEvents, tomorrowEvents);

    await app.client.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('✅ 夕方チェックを送信しました');
  } catch (error) {
    console.error('❌ 夕方チェック送信エラー:', error);

    await app.client.chat.postMessage({
      channel: channelId,
      text: '⚠️ 夕方チェックの生成に失敗しました\n\n設定を確認してください。',
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
      case 'today':
        await handleBriefingCommand(say);
        break;
      case 'tomorrow':
        await handleTomorrowCommand(say);
        break;
      case 'evening':
        await handleEveningCheckCommand(say);
        break;
      case 'yesterday':
        await handleYesterdayCommand(say);
        break;
      case 'help':
        await say('❓ 使用可能なコマンド:\n• `briefing` / `today` - 今日の予定\n• `tomorrow` - 明日の予定\n• `evening` - 夕方チェック\n• `yesterday` - 昨日の作業');
        break;
      default:
        await say('❓ 使用可能なコマンド:\n• `briefing` / `today` - 今日の予定\n• `tomorrow` - 明日の予定\n• `evening` - 夕方チェック\n• `yesterday` - 昨日の作業');
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

// /evening コマンド - 夕方チェックを表示
async function handleEveningCheckCommand(say: (message: string) => Promise<unknown>) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayEvents, tomorrowEvents] = await Promise.all([
      getTodayEvents(),
      getEventsForDate(tomorrow),
    ]);

    const message = generateEveningCheckMessage(todayEvents, tomorrowEvents);
    await say(message);
  } catch (error) {
    console.error('夕方チェックエラー:', error);
    await say('❌ 夕方チェックの取得に失敗しました\n\n設定を確認してください。');
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
    console.log(`⏰ 朝ブリーフィング: ${briefingTime}`);
    console.log(`⏰ 夕方チェック: ${eveningTime}`);
    console.log(`📅 投稿: ${weekdaysOnly ? '平日のみ' : '毎日'}`);

    // 朝のブリーフィング用cronジョブ
    const morning = parseCronTime(briefingTime);
    const morningCron = `${morning.minute} ${morning.hour} * * *`;

    cron.schedule(morningCron, async () => {
      console.log(`🕐 朝のブリーフィング時刻です (${briefingTime})`);
      await sendMorningBriefing();
    }, {
      timezone: 'Asia/Tokyo'
    });

    // 夕方チェック用cronジョブ
    const evening = parseCronTime(eveningTime);
    const eveningCron = `${evening.minute} ${evening.hour} * * *`;

    cron.schedule(eveningCron, async () => {
      console.log(`🕐 夕方チェック時刻です (${eveningTime})`);
      await sendEveningCheck();
    }, {
      timezone: 'Asia/Tokyo'
    });

    console.log(`📆 スケジューラーを開始しました`);
  } catch (error) {
    console.error('❌ 起動エラー:', error);
    process.exit(1);
  }
}

start();
