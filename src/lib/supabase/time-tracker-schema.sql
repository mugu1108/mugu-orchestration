-- ============================================
-- time-tracker テーブル定義
-- 業務委託の時間追跡システム用スキーマ
-- ============================================

-- ============================================
-- 1. projects テーブル（プロジェクト/クライアントマスタ）
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,           -- プロジェクト名
  client_name VARCHAR(255) NOT NULL,    -- クライアント名
  hourly_rate INTEGER NOT NULL,         -- 時間単価（円）
  is_active BOOLEAN DEFAULT true,       -- 有効フラグ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_name);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- ============================================
-- 2. time_logs テーブル（作業ログ）
-- ============================================
CREATE TABLE IF NOT EXISTS time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- 開始時刻
  ended_at TIMESTAMP WITH TIME ZONE,             -- 終了時刻（作業中はNULL）
  duration_minutes INTEGER,                       -- 経過時間（分）
  note TEXT,                                      -- メモ（オプション）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_time_logs_project ON time_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_started ON time_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_time_logs_ended ON time_logs(ended_at);
CREATE INDEX IF NOT EXISTS idx_time_logs_year_month ON time_logs(DATE_TRUNC('month', started_at));

-- ============================================
-- 3. invoices テーブル（請求書履歴）
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  year_month VARCHAR(7) NOT NULL,        -- 対象年月（例: 2026-01）
  total_minutes INTEGER NOT NULL,        -- 合計時間（分）
  total_amount INTEGER NOT NULL,         -- 合計金額（円）
  tax_amount INTEGER,                    -- 消費税（円）
  file_url TEXT,                         -- 生成したファイルのURL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユニーク制約（同じプロジェクト・月の重複防止）
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_unique ON invoices(project_id, year_month);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_invoices_year_month ON invoices(year_month);

-- ============================================
-- 4. ビュー定義（便利なクエリ用）
-- ============================================

-- 現在作業中のセッションを取得するビュー
CREATE OR REPLACE VIEW active_sessions AS
SELECT
  tl.id,
  tl.project_id,
  p.name AS project_name,
  p.client_name,
  tl.started_at,
  EXTRACT(EPOCH FROM (NOW() - tl.started_at)) / 60 AS elapsed_minutes
FROM time_logs tl
JOIN projects p ON tl.project_id = p.id
WHERE tl.ended_at IS NULL;

-- 今日の作業サマリーを取得するビュー
CREATE OR REPLACE VIEW today_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.client_name,
  COUNT(tl.id) AS session_count,
  COALESCE(SUM(tl.duration_minutes), 0) AS total_minutes
FROM projects p
LEFT JOIN time_logs tl ON p.id = tl.project_id
  AND DATE(tl.started_at AT TIME ZONE 'Asia/Tokyo') = DATE(NOW() AT TIME ZONE 'Asia/Tokyo')
  AND tl.ended_at IS NOT NULL
WHERE p.is_active = true
GROUP BY p.id, p.name, p.client_name;

-- 月間サマリーを取得するビュー
CREATE OR REPLACE VIEW monthly_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.client_name,
  p.hourly_rate,
  TO_CHAR(tl.started_at, 'YYYY-MM') AS year_month,
  COUNT(tl.id) AS session_count,
  COALESCE(SUM(tl.duration_minutes), 0) AS total_minutes,
  ROUND(COALESCE(SUM(tl.duration_minutes), 0) / 60.0, 2) AS total_hours,
  ROUND(COALESCE(SUM(tl.duration_minutes), 0) / 60.0 * p.hourly_rate) AS total_amount
FROM projects p
LEFT JOIN time_logs tl ON p.id = tl.project_id AND tl.ended_at IS NOT NULL
WHERE p.is_active = true
GROUP BY p.id, p.name, p.client_name, p.hourly_rate, TO_CHAR(tl.started_at, 'YYYY-MM');

-- ============================================
-- 5. RLS（Row Level Security）設定
-- ============================================
-- 注: 必要に応じて有効化してください

-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. サンプルデータ（テスト用）
-- ============================================
-- 注: 本番環境では実行しないでください

-- INSERT INTO projects (name, client_name, hourly_rate) VALUES
--   ('プロジェクトA', '株式会社A', 5000),
--   ('プロジェクトB', '株式会社B', 4500),
--   ('保守案件C', '株式会社A', 4000);
