import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  department_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  branch_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  content?: string;
  file_type: string;
  file_name?: string;
  file_size?: number;
  file_url?: string;
  is_handwritten: boolean;
  batch?: string;
  upload_type: string;
  created_at: string;
  updated_at: string;
}