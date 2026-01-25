import { supabase } from './supabase/client.js';
import type { Skill, SkillExecution } from '../types/skill.js';

export class SkillManager {
  async registerSkill(skill: Skill): Promise<void> {
    const { error } = await supabase.from('skills').insert({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      triggers: skill.triggers,
      template_path: skill.template_path,
      metadata: skill.metadata || {},
      is_active: true
    });

    if (error) {
      throw new Error(`Failed to register skill: ${error.message}`);
    }
  }

  async getSkill(name: string): Promise<Skill | null> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('name', name)
      .single();

    if (error) return null;
    return data as Skill;
  }

  async listSkills(category?: string): Promise<Skill[]> {
    let query = supabase.from('skills').select('*').eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list skills: ${error.message}`);
    }

    return data as Skill[];
  }

  async updateSkill(name: string, updates: Partial<Skill>): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .update(updates)
      .eq('name', name);

    if (error) {
      throw new Error(`Failed to update skill: ${error.message}`);
    }
  }

  async deleteSkill(name: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .update({ is_active: false })
      .eq('name', name);

    if (error) {
      throw new Error(`Failed to delete skill: ${error.message}`);
    }
  }

  async logExecution(execution: SkillExecution): Promise<void> {
    const { error } = await supabase.from('skill_executions').insert({
      skill_name: execution.skill_name,
      context: execution.context,
      result: execution.result,
      duration_ms: execution.duration_ms,
      success: execution.success,
      error_message: execution.error_message,
      user_id: execution.user_id || process.env.DEFAULT_USER_ID
    });

    if (error) {
      console.error('Failed to log skill execution:', error);
    }
  }

  async getExecutionHistory(skillName?: string, limit = 100): Promise<SkillExecution[]> {
    let query = supabase
      .from('skill_executions')
      .select('*')
      .order('executed_at', { ascending: false })
      .limit(limit);

    if (skillName) {
      query = query.eq('skill_name', skillName);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get execution history: ${error.message}`);
    }

    return data as SkillExecution[];
  }
}
