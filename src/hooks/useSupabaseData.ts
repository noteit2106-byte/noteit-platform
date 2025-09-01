import { useState, useEffect } from 'react';
import { supabase, Department, Branch, Subject, Note } from '@/lib/supabase';

export interface DepartmentWithBranches extends Department {
  branches: BranchWithSubjects[];
}

export interface BranchWithSubjects extends Branch {
  subjects: SubjectWithNotes[];
}

export interface SubjectWithNotes extends Subject {
  notes: Note[];
}

export const useSupabaseData = () => {
  const [departments, setDepartments] = useState<DepartmentWithBranches[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch departments with nested data
      const { data: departmentsData, error: deptError } = await supabase
        .from('departments')
        .select(`
          *,
          branches (
            *,
            subjects (
              *,
              notes (*)
            )
          )
        `)
        .order('name');

      if (deptError) throw deptError;

      setDepartments(departmentsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNote = async (noteData: {
    subject_id: string;
    title: string;
    description: string;
    content?: string;
    file_type: string;
    file_name?: string;
    file_size?: number;
    file_url?: string;
    is_handwritten: boolean;
    batch?: string;
    upload_type: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      // Refresh data after adding note
      await fetchData();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Refresh data after deleting note
      await fetchData();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const getNoteById = async (noteId: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch note');
    }
  };

  return {
    departments,
    loading,
    error,
    addNote,
    deleteNote,
    getNoteById,
    refetch: fetchData
  };
};