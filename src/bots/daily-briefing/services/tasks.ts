import { google } from 'googleapis';
import { getGoogleAuthClient } from './google-auth.js';

export interface GoogleTask {
  id: string;
  title: string;
  due?: Date;
  status: 'needsAction' | 'completed';
}

// Google Tasks クライアントを初期化
function getTasksClient() {
  const auth = getGoogleAuthClient();
  return google.tasks({ version: 'v1', auth });
}

// 指定日が期限のタスク（未完了のみ）を取得
async function getTasksByDueDate(date: Date): Promise<GoogleTask[]> {
  const tasksClient = getTasksClient();

  // RFC 3339 形式で日の範囲を指定
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

  const response = await tasksClient.tasks.list({
    tasklist: '@default',
    showCompleted: false,
    dueMin: startOfDay.toISOString(),
    dueMax: endOfDay.toISOString(),
  });

  const items = response.data.items || [];

  return items.map((item): GoogleTask => ({
    id: item.id || '',
    title: item.title || '(タイトルなし)',
    due: item.due ? new Date(item.due) : undefined,
    status: (item.status as GoogleTask['status']) || 'needsAction',
  }));
}

// 今日期限のタスクを取得
export async function getTodayTasks(): Promise<GoogleTask[]> {
  return getTasksByDueDate(new Date());
}

// 明日期限のタスクを取得
export async function getTomorrowTasks(): Promise<GoogleTask[]> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getTasksByDueDate(tomorrow);
}
