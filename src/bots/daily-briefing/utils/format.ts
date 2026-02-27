import { CalendarEvent } from '../services/calendar.js';
import { GoogleTask } from '../services/tasks.js';
import { WorkSummary } from '../services/timetracker.js';

// 曜日の日本語表記
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 時刻をフォーマット（HH:MM）
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 日付をフォーマット（M月D日（曜日））
export function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${month}月${day}日（${weekday}）`;
}

// イベントを1行でフォーマット
export function formatEventLine(event: CalendarEvent): string {
  if (event.isAllDay) {
    return `📌 終日 | ${event.title}`;
  }

  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  return `🔵 ${start}-${end} | ${event.title}`;
}

// タスクセクションを生成
function formatTaskSection(tasks: GoogleTask[], label: string): string {
  let section = `\n✅ ${label}\n`;

  if (tasks.length === 0) {
    section += `タスクはありません\n`;
  } else {
    for (const task of tasks) {
      section += `• ${task.title}\n`;
    }
  }

  return section;
}

// ブリーフィングメッセージを生成
export function generateBriefingMessage(events: CalendarEvent[]): string {
  const today = new Date();
  const dateStr = formatDate(today);

  let message = `☀️ おはようございます！${dateStr}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (events.length === 0) {
    message += `📅 今日の予定\n`;
    message += `予定はありません\n\n`;
  } else {
    message += `📅 今日の予定（${events.length}件）\n\n`;

    // 終日イベントを先に表示
    const allDayEvents = events.filter(e => e.isAllDay);
    const timedEvents = events.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `${formatEventLine(event)}\n`;
    }

    for (const event of timedEvents) {
      message += `${formatEventLine(event)}\n`;
    }

    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💡 今日も良い1日を！`;

  return message;
}

// 挨拶を時間帯で変える
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 10) {
    return 'おはようございます';
  } else if (hour < 17) {
    return 'こんにちは';
  } else {
    return 'こんばんは';
  }
}

// 手動実行用のブリーフィングメッセージを生成
export function generateManualBriefingMessage(
  events: CalendarEvent[],
  tasks: GoogleTask[] = []
): string {
  const today = new Date();
  const dateStr = formatDate(today);
  const greeting = getGreeting();

  let message = `☀️ ${greeting}！${dateStr}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (events.length === 0) {
    message += `📅 今日の予定\n`;
    message += `予定はありません\n\n`;
  } else {
    message += `📅 今日の予定（${events.length}件）\n\n`;

    const allDayEvents = events.filter(e => e.isAllDay);
    const timedEvents = events.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `${formatEventLine(event)}\n`;
    }

    for (const event of timedEvents) {
      message += `${formatEventLine(event)}\n`;
    }

    message += `\n`;
  }

  if (tasks.length > 0) {
    message += formatTaskSection(tasks, '今日期限のタスク');
    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━`;

  return message;
}

// 分を「X時間Y分」形式にフォーマット
export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0分';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}分`;
  }
  if (mins === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${mins}分`;
}

// 作業サマリーメッセージを生成
export function generateWorkSummaryMessage(summaries: WorkSummary[], label: string): string {
  let message = `⏱️ 【${label}の作業】\n\n`;

  if (summaries.length === 0) {
    message += `作業記録がありません\n`;
  } else {
    let totalMinutes = 0;

    for (const summary of summaries) {
      message += `📁 ${summary.project_name}: ${formatDuration(summary.total_minutes)}\n`;
      totalMinutes += summary.total_minutes;
    }

    message += `\n合計: ${formatDuration(totalMinutes)}`;
  }

  return message;
}

// 明日の予定メッセージを生成
export function generateTomorrowMessage(events: CalendarEvent[]): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = formatDate(tomorrow);

  let message = `📅 【明日の予定】${dateStr}\n\n`;

  if (events.length === 0) {
    message += `予定はありません\n`;
  } else {
    const allDayEvents = events.filter(e => e.isAllDay);
    const timedEvents = events.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `${formatEventLine(event)}\n`;
    }

    for (const event of timedEvents) {
      message += `${formatEventLine(event)}\n`;
    }
  }

  return message;
}

// 朝のブリーフィングメッセージを生成
export function generateMorningBriefingMessage(
  events: CalendarEvent[],
  tasks: GoogleTask[] = []
): string {
  const today = new Date();
  const dateStr = formatDate(today);

  let message = `☀️ おはようございます！${dateStr}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (events.length === 0) {
    message += `📅 今日の予定\n`;
    message += `予定はありません\n\n`;
  } else {
    message += `📅 今日の予定\n\n`;

    const allDayEvents = events.filter(e => e.isAllDay);
    const timedEvents = events.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `• 終日 | ${event.title}\n`;
    }

    for (const event of timedEvents) {
      const start = formatTime(event.startTime);
      const end = formatTime(event.endTime);
      message += `• ${start}-${end} | ${event.title}\n`;
    }

    message += `\n`;
  }

  if (tasks.length > 0) {
    message += formatTaskSection(tasks, '今日期限のタスク');
    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💡 今日も良い1日を！`;

  return message;
}

// 夕方チェック用イベントをフォーマット（チェックボックス形式）
function formatEventCheckLine(event: CalendarEvent): string {
  if (event.isAllDay) {
    return `☐ 終日 | ${event.title}`;
  }
  const start = formatTime(event.startTime);
  return `☐ ${start} | ${event.title}`;
}

// 夕方チェックメッセージを生成
export function generateEveningCheckMessage(
  todayEvents: CalendarEvent[],
  tomorrowEvents: CalendarEvent[],
  todayTasks: GoogleTask[] = [],
  tomorrowTasks: GoogleTask[] = []
): string {
  const today = new Date();
  const dateStr = formatDate(today);
  const timeStr = formatTime(today);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateStr = formatDate(tomorrow);

  let message = `🌆 お疲れ様です！${dateStr} ${timeStr}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // 今日の予定 - 完了チェック
  message += `📋 今日の予定 - 完了チェック\n`;

  if (todayEvents.length === 0) {
    message += `予定はありませんでした\n\n`;
  } else {
    const allDayEvents = todayEvents.filter(e => e.isAllDay);
    const timedEvents = todayEvents.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `${formatEventCheckLine(event)}\n`;
    }

    for (const event of timedEvents) {
      message += `${formatEventCheckLine(event)}\n`;
    }

    message += `\n`;
  }

  if (todayTasks.length > 0) {
    message += formatTaskSection(todayTasks, '今日期限のタスク - 完了チェック');
    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // 明日の予定
  message += `📅 明日の予定（${tomorrowDateStr}）\n`;

  if (tomorrowEvents.length === 0) {
    message += `予定はありません\n\n`;
  } else {
    const allDayEvents = tomorrowEvents.filter(e => e.isAllDay);
    const timedEvents = tomorrowEvents.filter(e => !e.isAllDay);

    for (const event of allDayEvents) {
      message += `• 終日 | ${event.title}\n`;
    }

    for (const event of timedEvents) {
      const start = formatTime(event.startTime);
      message += `• ${start} | ${event.title}\n`;
    }

    message += `\n`;
  }

  if (tomorrowTasks.length > 0) {
    message += formatTaskSection(tomorrowTasks, '明日期限のタスク');
    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💡 今日も1日お疲れ様でした！`;

  return message;
}
