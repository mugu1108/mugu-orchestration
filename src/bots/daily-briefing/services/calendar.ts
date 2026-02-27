import { google, calendar_v3 } from 'googleapis';
import { getGoogleAuthClient } from './google-auth.js';

// カレンダーイベントの型
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  location?: string;
  description?: string;
  htmlLink?: string;
}

// Google Calendar クライアントを初期化（OAuth 2.0）
function getCalendarClient(): calendar_v3.Calendar {
  const auth = getGoogleAuthClient();
  return google.calendar({ version: 'v3', auth });
}

// 今日のイベントを取得
export async function getTodayEvents(): Promise<CalendarEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID が設定されていません');
  }

  const calendar = getCalendarClient();

  // 今日の開始と終了を取得（日本時間）
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items || [];

  return events.map((event): CalendarEvent => {
    const isAllDay = !event.start?.dateTime;

    let startTime: Date;
    let endTime: Date;

    if (isAllDay) {
      // 終日イベント
      startTime = new Date(event.start?.date || '');
      endTime = new Date(event.end?.date || '');
    } else {
      // 時間指定イベント
      startTime = new Date(event.start?.dateTime || '');
      endTime = new Date(event.end?.dateTime || '');
    }

    return {
      id: event.id || '',
      title: event.summary || '(タイトルなし)',
      startTime,
      endTime,
      isAllDay,
      location: event.location || undefined,
      description: event.description || undefined,
      htmlLink: event.htmlLink || undefined,
    };
  });
}

// 指定日のイベントを取得
export async function getEventsForDate(date: Date): Promise<CalendarEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID が設定されていません');
  }

  const calendar = getCalendarClient();

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items || [];

  return events.map((event): CalendarEvent => {
    const isAllDay = !event.start?.dateTime;

    let startTime: Date;
    let endTime: Date;

    if (isAllDay) {
      startTime = new Date(event.start?.date || '');
      endTime = new Date(event.end?.date || '');
    } else {
      startTime = new Date(event.start?.dateTime || '');
      endTime = new Date(event.end?.dateTime || '');
    }

    return {
      id: event.id || '',
      title: event.summary || '(タイトルなし)',
      startTime,
      endTime,
      isAllDay,
      location: event.location || undefined,
      description: event.description || undefined,
      htmlLink: event.htmlLink || undefined,
    };
  });
}
