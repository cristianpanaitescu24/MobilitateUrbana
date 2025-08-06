// lib/deleteReport.ts
import { supabase } from './supabaseClient';

export async function deleteReport(id: string) {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);
    console.log("ID:", id);

  if (error) {
    console.error('Delete failed:', error.message);
    return false;
  }
  else
    console.log("Succes delete ID:", id);

  return true;
}