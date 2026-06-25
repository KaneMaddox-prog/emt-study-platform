import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://euwsucslgglynubmpdcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1d3N1Y3NsZ2dseW51Ym1wZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNjE0MzAsImV4cCI6MjA5NzczNzQzMH0.3HGq9yho90vh1uL2q82yrqaGRvLPmwyzQdaQXn6EHCk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
