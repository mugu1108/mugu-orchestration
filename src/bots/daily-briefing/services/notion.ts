import { Client } from '@notionhq/client';

// タスクの型
export interface NotionTask {
  id: string;
  title: string;
  status: string;
  dueDate: Date | null;
  description?: string;
  url: string;
}

// Notion クライアントを初期化
function getNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error('NOTION_API_KEY が設定されていません');
  }

  return new Client({ auth: apiKey });
}

// 日付範囲でタスクを取得
export async function getTasksByDateRange(
  startDate: Date,
  endDate: Date
): Promise<NotionTask[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID が設定されていません');
  }

  const notion = getNotionClient() as any;

  // フィルター条件を構築
  const dateFilter = {
    and: [
      {
        property: '期限',
        date: {
          on_or_after: startDate.toISOString().split('T')[0],
        },
      },
      {
        property: '期限',
        date: {
          on_or_before: endDate.toISOString().split('T')[0],
        },
      },
      {
        property: 'ステータス',
        status: {
          does_not_equal: '完了',
        },
      },
    ],
  };

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: dateFilter,
    sorts: [
      {
        property: '期限',
        direction: 'ascending',
      },
    ],
  });

  return response.results.map((page: any) => {
    const properties = page.properties;

    // タイトルを取得
    const titleProperty = properties['タスク名'];
    const title = titleProperty?.title?.[0]?.plain_text || '(タイトルなし)';

    // ステータスを取得
    const statusProperty = properties['ステータス'];
    const status = statusProperty?.status?.name || '未設定';

    // 期限を取得
    const dueDateProperty = properties['期限'];
    const dueDateStr = dueDateProperty?.date?.start;
    const dueDate = dueDateStr ? new Date(dueDateStr) : null;

    // 詳細を取得
    const descProperty = properties['詳細'];
    const description = descProperty?.rich_text?.[0]?.plain_text || undefined;

    return {
      id: page.id,
      title,
      status,
      dueDate,
      description,
      url: page.url,
    };
  });
}

// 今日のタスクを取得
export async function getTodayTasks(): Promise<NotionTask[]> {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return getTasksByDateRange(startOfDay, endOfDay);
}

// 今週のタスクを取得
export async function getWeekTasks(): Promise<NotionTask[]> {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return getTasksByDateRange(monday, sunday);
}

// 進行中のタスクを取得（期限に関係なく）
export async function getInProgressTasks(): Promise<NotionTask[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID が設定されていません');
  }

  const notion = getNotionClient() as any;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'ステータス',
      status: {
        equals: '進行中',
      },
    },
    sorts: [
      {
        property: '期限',
        direction: 'ascending',
      },
    ],
  });

  return response.results.map((page: any) => {
    const properties = page.properties;

    const titleProperty = properties['タスク名'];
    const title = titleProperty?.title?.[0]?.plain_text || '(タイトルなし)';

    const statusProperty = properties['ステータス'];
    const status = statusProperty?.status?.name || '未設定';

    const dueDateProperty = properties['期限'];
    const dueDateStr = dueDateProperty?.date?.start;
    const dueDate = dueDateStr ? new Date(dueDateStr) : null;

    const descProperty = properties['詳細'];
    const description = descProperty?.rich_text?.[0]?.plain_text || undefined;

    return {
      id: page.id,
      title,
      status,
      dueDate,
      description,
      url: page.url,
    };
  });
}
