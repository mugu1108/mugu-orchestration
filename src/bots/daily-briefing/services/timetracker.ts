import { supabase } from '../../../lib/supabase/client.js';

// 作業サマリーの型
export interface WorkSummary {
  project_name: string;
  total_minutes: number;
  session_count: number;
}

// 前日の作業サマリーを取得
export async function getYesterdaySummary(): Promise<WorkSummary[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return getDailySummary(yesterday);
}

// 指定日の作業サマリーを取得
export async function getDailySummary(date: Date): Promise<WorkSummary[]> {
  // 日本時間で日付の開始と終了を計算
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

  const { data, error } = await supabase
    .from('time_logs')
    .select(`
      project_id,
      duration_minutes,
      projects!inner (
        name
      )
    `)
    .gte('started_at', startOfDay.toISOString())
    .lte('started_at', endOfDay.toISOString())
    .not('ended_at', 'is', null);

  if (error || !data) {
    console.error('作業サマリー取得エラー:', error);
    return [];
  }

  // プロジェクト別に集計
  const summaryMap = new Map<string, WorkSummary>();

  for (const log of data) {
    const project = log.projects as unknown as { name: string };
    const projectName = project.name;

    if (!summaryMap.has(projectName)) {
      summaryMap.set(projectName, {
        project_name: projectName,
        total_minutes: 0,
        session_count: 0,
      });
    }

    const summary = summaryMap.get(projectName)!;
    summary.total_minutes += log.duration_minutes || 0;
    summary.session_count += 1;
  }

  return Array.from(summaryMap.values()).sort((a, b) => b.total_minutes - a.total_minutes);
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
