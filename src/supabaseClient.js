// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxqycdlwytjtzwjbjbyw.supabase.co'; // 👈 Ganti ini pake URL yang tadi lu copy
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cXljZGx3eXRqdHp3amJqYnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODQ0MjAsImV4cCI6MjA5MTU2MDQyMH0.8PUcMSZntxDhuuzHBOVvD2s2AfoZMS1rXXDEx60QVoo'; // 👈 Ganti ini pake Kunci yang tadi lu copy

export const supabase = createClient(supabaseUrl, supabaseAnonKey);