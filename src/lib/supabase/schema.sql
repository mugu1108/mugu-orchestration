-- ========================================
-- mugu-orchestration Database Schema
-- ========================================

-- ========================================
-- 1. スキル実行履歴テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS skill_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id VARCHAR(255),
  context JSONB,
  result JSONB,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_executions_skill_name ON skill_executions(skill_name);
CREATE INDEX IF NOT EXISTS idx_skill_executions_executed_at ON skill_executions(executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_executions_user_id ON skill_executions(user_id);

-- ========================================
-- 2. スキル定義管理テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  triggers JSONB,
  template_path VARCHAR(500),
  metadata JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_is_active ON skills(is_active);

-- ========================================
-- 3. エージェント実行履歴テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(255) NOT NULL,
  task_description TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id VARCHAR(255),
  tools_used JSONB,
  model VARCHAR(100),
  token_usage JSONB,
  result JSONB,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_name ON agent_executions(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_executions_executed_at ON agent_executions(executed_at DESC);

-- ========================================
-- 4. 設定管理テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_configurations_key ON configurations(key);

-- ========================================
-- Row Level Security (RLS) 設定
-- ========================================

-- すべてのテーブルでRLSを有効化
ALTER TABLE skill_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- サービスロール用のポリシー（すべてアクセス可能）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'skill_executions'
    AND policyname = 'Service role can do everything'
  ) THEN
    CREATE POLICY "Service role can do everything" ON skill_executions
      FOR ALL USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'skills'
    AND policyname = 'Service role can do everything'
  ) THEN
    CREATE POLICY "Service role can do everything" ON skills
      FOR ALL USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'agent_executions'
    AND policyname = 'Service role can do everything'
  ) THEN
    CREATE POLICY "Service role can do everything" ON agent_executions
      FOR ALL USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'configurations'
    AND policyname = 'Service role can do everything'
  ) THEN
    CREATE POLICY "Service role can do everything" ON configurations
      FOR ALL USING (true);
  END IF;
END $$;

-- ========================================
-- トリガー: updated_at の自動更新
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_skill_executions_updated_at'
  ) THEN
    CREATE TRIGGER update_skill_executions_updated_at
      BEFORE UPDATE ON skill_executions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_skills_updated_at'
  ) THEN
    CREATE TRIGGER update_skills_updated_at
      BEFORE UPDATE ON skills
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_agent_executions_updated_at'
  ) THEN
    CREATE TRIGGER update_agent_executions_updated_at
      BEFORE UPDATE ON agent_executions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_configurations_updated_at'
  ) THEN
    CREATE TRIGGER update_configurations_updated_at
      BEFORE UPDATE ON configurations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
