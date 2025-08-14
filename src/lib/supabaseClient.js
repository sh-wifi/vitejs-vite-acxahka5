import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwazdgaomnxwbipmrklh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YXpkZ2FvbW54d2JpcG1ya2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzY5MzksImV4cCI6MjA3MDY1MjkzOX0.19yxEhL4v7_cpiCEjRjjL0-wU7eafL1dBw1kYe4K80Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
