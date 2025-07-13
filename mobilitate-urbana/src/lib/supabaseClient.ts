import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://byttzzmuyhqufkjscmou.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dHR6em11eWhxdWZranNjbW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTYzNzYsImV4cCI6MjA2Njc5MjM3Nn0.6xlBmh9Pw0lDvOcNMferZp74Pakyz6UFqqTag8C_MkU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


