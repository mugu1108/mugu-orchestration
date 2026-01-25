export interface Config {
  id?: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  is_sensitive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface ProjectConfig {
  name: string;
  version: string;
  author: string;
  supabase: SupabaseConfig;
}
