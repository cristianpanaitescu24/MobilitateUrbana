// lib/deleteReport.ts
import { supabase } from './supabaseClient';

export async function deleteReport(id: string) {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete failed:', error.message);
    return false;
  }

  return true;
}