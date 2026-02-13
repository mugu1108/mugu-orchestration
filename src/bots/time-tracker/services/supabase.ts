import { supabase } from '../../../lib/supabase/client.js';

// 型定義
export interface Project {
  id: string;
  name: string;
  client_name: string;
  hourly_rate: number;
  is_active: boolean;
}

export interface TimeLog {
  id: string;
  project_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  note: string | null;
}

export interface ActiveSession {
  id: string;
  project_id: string;
  project_name: string;
  client_name: string;
  started_at: string;
  elapsed_minutes: number;
}

// プロジェクト取得
export async function getProjectByName(name: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('name', name)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as Project;
}

// アクティブプロジェクト一覧取得
export async function getActiveProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error || !data) return [];
  return data as Project[];
}

// 現在作業中のセッションを取得
export async function getActiveSession(): Promise<ActiveSession | null> {
  const { data, error } = await supabase
    .from('active_sessions')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as ActiveSession;
}

// 作業開始
export async function startWork(projectId: string): Promise<TimeLog | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('time_logs')
    .insert({
      project_id: projectId,
      started_at: now,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('作業開始エラー:', error);
    return null;
  }
  return data as TimeLog;
}

// 作業終了
export async function endWork(sessionId: string): Promise<TimeLog | null> {
  const now = new Date();

  // 現在のセッションを取得
  const { data: session, error: fetchError } = await supabase
    .from('time_logs')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError || !session) {
    console.error('セッション取得エラー:', fetchError);
    return null;
  }

  // 経過時間を計算（分）
  const startedAt = new Date(session.started_at);
  const durationMinutes = Math.round((now.getTime() - startedAt.getTime()) / 60000);

  // 終了時刻と経過時間を更新
  const { data, error } = await supabase
    .from('time_logs')
    .update({
      ended_at: now.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error || !data) {
    console.error('作業終了エラー:', error);
    return null;
  }
  return data as TimeLog;
}

// 今日の合計作業時間を取得
export async function getTodayTotalMinutes(): Promise<number> {
  const { data, error } = await supabase
    .from('today_summary')
    .select('total_minutes');

  if (error || !data) return 0;

  const total = data.reduce((sum, row) => sum + (row.total_minutes || 0), 0);
  return total;
}

// 今日のプロジェクト別サマリーを取得
export async function getTodaySummary(): Promise<{ project_name: string; total_minutes: number }[]> {
  const { data, error } = await supabase
    .from('today_summary')
    .select('project_name, total_minutes')
    .gt('total_minutes', 0);

  if (error || !data) return [];
  return data;
}

// 作業時間を直接追加（/addコマンド用）
export async function addWorkTime(
  projectId: string,
  durationMinutes: number,
  note?: string
): Promise<TimeLog | null> {
  const now = new Date();
  // 終了時刻を現在時刻、開始時刻を終了時刻からdurationMinutes分前に設定
  const endedAt = now.toISOString();
  const startedAt = new Date(now.getTime() - durationMinutes * 60000).toISOString();

  const { data, error } = await supabase
    .from('time_logs')
    .insert({
      project_id: projectId,
      started_at: startedAt,
      ended_at: endedAt,
      duration_minutes: durationMinutes,
      note: note || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('作業時間追加エラー:', error);
    return null;
  }
  return data as TimeLog;
}

// 月間集計データの型
export interface MonthlySummary {
  project_id: string;
  project_name: string;
  client_name: string;
  hourly_rate: number;
  total_minutes: number;
  total_amount: number;
  session_count: number;
}

// 指定月の集計を取得
export async function getMonthlySummary(yearMonth: string): Promise<MonthlySummary[]> {
  // yearMonth: 'YYYY-MM' 形式
  const startDate = `${yearMonth}-01`;
  const [year, month] = yearMonth.split('-').map(Number);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const { data, error } = await supabase
    .from('time_logs')
    .select(`
      project_id,
      duration_minutes,
      projects!inner (
        name,
        client_name,
        hourly_rate
      )
    `)
    .gte('started_at', startDate)
    .lt('started_at', endDate)
    .not('ended_at', 'is', null);

  if (error || !data) {
    console.error('月間集計エラー:', error);
    return [];
  }

  // プロジェクト別に集計
  const summaryMap = new Map<string, MonthlySummary>();

  for (const log of data) {
    const projectId = log.project_id;
    const project = log.projects as unknown as { name: string; client_name: string; hourly_rate: number };

    if (!summaryMap.has(projectId)) {
      summaryMap.set(projectId, {
        project_id: projectId,
        project_name: project.name,
        client_name: project.client_name,
        hourly_rate: project.hourly_rate,
        total_minutes: 0,
        total_amount: 0,
        session_count: 0,
      });
    }

    const summary = summaryMap.get(projectId)!;
    summary.total_minutes += log.duration_minutes || 0;
    summary.session_count += 1;
  }

  // 金額を計算
  for (const summary of summaryMap.values()) {
    summary.total_amount = Math.round((summary.total_minutes / 60) * summary.hourly_rate);
  }

  return Array.from(summaryMap.values()).sort((a, b) => b.total_minutes - a.total_minutes);
}

// 週間集計を取得
export async function getWeeklySummary(): Promise<{ project_name: string; total_minutes: number; session_count: number }[]> {
  // 今週の月曜日を取得（日本時間）
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const jstNow = new Date(now.getTime() + jstOffset);
  const dayOfWeek = jstNow.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(jstNow);
  monday.setUTCDate(monday.getUTCDate() - mondayOffset);
  monday.setUTCHours(0, 0, 0, 0);

  // UTC に戻す
  const startDate = new Date(monday.getTime() - jstOffset).toISOString();

  const { data, error } = await supabase
    .from('time_logs')
    .select(`
      project_id,
      duration_minutes,
      projects!inner (
        name
      )
    `)
    .gte('started_at', startDate)
    .not('ended_at', 'is', null);

  if (error || !data) {
    console.error('週間集計エラー:', error);
    return [];
  }

  // プロジェクト別に集計
  const summaryMap = new Map<string, { project_name: string; total_minutes: number; session_count: number }>();

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

// 直近の作業記録を削除
export async function deleteLastTimeLog(): Promise<TimeLog | null> {
  // 直近の完了した記録を取得
  const { data: lastLog, error: fetchError } = await supabase
    .from('time_logs')
    .select('*, projects!inner(name)')
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !lastLog) {
    console.error('直近の記録取得エラー:', fetchError);
    return null;
  }

  // 削除
  const { error: deleteError } = await supabase
    .from('time_logs')
    .delete()
    .eq('id', lastLog.id);

  if (deleteError) {
    console.error('記録削除エラー:', deleteError);
    return null;
  }

  return lastLog as TimeLog;
}

// プロジェクト追加
export async function addProject(
  name: string,
  hourlyRate: number,
  clientName?: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      hourly_rate: hourlyRate,
      client_name: clientName || name,
      is_active: true,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('プロジェクト追加エラー:', error);
    return null;
  }

  return data as Project;
}
