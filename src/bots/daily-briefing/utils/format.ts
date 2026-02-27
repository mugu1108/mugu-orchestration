import { CalendarEvent } from '../services/calendar.js';
import { NotionTask } from '../services/notion.js';
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
export function generateManualBriefingMessage(events: CalendarEvent[]): string {
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

// タスクをフォーマット
export function formatTaskLine(task: NotionTask): string {
  const statusEmoji = task.status === '進行中' ? '🔵' : '⚪';
  const dueDateStr = task.dueDate ? `(${task.dueDate.getMonth() + 1}/${task.dueDate.getDate()})` : '';
  return `${statusEmoji} ${task.title} ${dueDateStr}`;
}

// 今日のタスクメッセージを生成
export function generateTodayTasksMessage(tasks: NotionTask[]): string {
  const today = new Date();
  const dateStr = formatDate(today);

  let message = `📋 【今日のタスク】${dateStr}\n\n`;

  if (tasks.length === 0) {
    message += `今日期限のタスクはありません\n`;
  } else {
    for (const task of tasks) {
      message += `${formatTaskLine(task)}\n`;
    }
  }

  return message;
}

// 週間タスクメッセージを生成
export function generateWeekTasksMessage(tasks: NotionTask[]): string {
  let message = `📋 【今週のタスク】\n\n`;

  if (tasks.length === 0) {
    message += `今週期限のタスクはありません\n`;
  } else {
    // 日付ごとにグループ化
    const grouped = new Map<string, NotionTask[]>();

    for (const task of tasks) {
      const key = task.dueDate
        ? `${task.dueDate.getMonth() + 1}/${task.dueDate.getDate()}(${WEEKDAYS[task.dueDate.getDay()]})`
        : '期限なし';

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(task);
    }

    for (const [date, dateTasks] of grouped) {
      message += `📅 ${date}\n`;
      for (const task of dateTasks) {
        const statusEmoji = task.status === '進行中' ? '🔵' : '⚪';
        message += `  ${statusEmoji} ${task.title}\n`;
      }
      message += `\n`;
    }
  }

  return message;
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

// 拡張ブリーフィングメッセージを生成（カレンダー + タスク + 前日サマリー）
export function generateFullBriefingMessage(
  events: CalendarEvent[],
  todayTasks: NotionTask[],
  weekTasks: NotionTask[],
  yesterdaySummary: WorkSummary[]
): string {
  const today = new Date();
  const dateStr = formatDate(today);

  let message = `☀️ おはようございます！${dateStr}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // 今日の予定
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

  // 今日のタスク
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (todayTasks.length === 0) {
    message += `📋 今日のタスク\n`;
    message += `今日期限のタスクはありません\n\n`;
  } else {
    message += `📋 今日のタスク（${todayTasks.length}件）\n\n`;

    for (const task of todayTasks) {
      const statusEmoji = task.status === '進行中' ? '🔵' : '⚪';
      message += `${statusEmoji} ${task.title}\n`;
    }

    message += `\n`;
  }

  // 今週のタスク（今日以外）
  const todayStr = today.toISOString().split('T')[0];
  const otherWeekTasks = weekTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDateStr = task.dueDate.toISOString().split('T')[0];
    return taskDateStr !== todayStr;
  });

  if (otherWeekTasks.length > 0) {
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 今週のタスク（${otherWeekTasks.length}件）\n\n`;

    // 日付ごとにグループ化
    const grouped = new Map<string, NotionTask[]>();

    for (const task of otherWeekTasks) {
      const key = task.dueDate
        ? `${task.dueDate.getMonth() + 1}/${task.dueDate.getDate()}(${WEEKDAYS[task.dueDate.getDay()]})`
        : '期限なし';

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(task);
    }

    for (const [date, dateTasks] of grouped) {
      message += `📅 ${date}\n`;
      for (const task of dateTasks) {
        const statusEmoji = task.status === '進行中' ? '🔵' : '⚪';
        message += `  ${statusEmoji} ${task.title}\n`;
      }
    }

    message += `\n`;
  }

  // 前日の作業サマリー
  if (yesterdaySummary.length > 0) {
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `⏱️ 昨日の作業\n\n`;

    let totalMinutes = 0;
    for (const summary of yesterdaySummary) {
      message += `📁 ${summary.project_name}: ${formatDuration(summary.total_minutes)}\n`;
      totalMinutes += summary.total_minutes;
    }

    message += `\n合計: ${formatDuration(totalMinutes)}\n\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💡 今日も良い1日を！`;

  return message;
}
