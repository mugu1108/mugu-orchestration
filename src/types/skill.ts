export interface Skill {
  id?: string;
  name: string;
  description: string;
  category: string;
  triggers: string[];
  template_path: string;
  metadata?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SkillExecution {
  id?: string;
  skill_name: string;
  executed_at?: string;
  user_id?: string;
  context: Record<string, any>;
  result: Record<string, any>;
  duration_ms: number;
  success: boolean;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
}

export type SkillCategory =
  | 'automation'
  | 'documentation'
  | 'analysis'
  | 'integration'
  | 'workflow';

export type SkillTemplate =
  | 'automation'
  | 'agent'
  | 'mcp'
  | 'workflow';
