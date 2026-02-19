import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beeszzrzbnhihjwgocxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZXN6enJ6Ym5oaWhqd2dvY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc2MTgsImV4cCI6MjA4NzA5MzYxOH0.UPtsdsdWKu_j5DJFqv7I7bkcAfRxYOHgGRp2NH3Tj-k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
