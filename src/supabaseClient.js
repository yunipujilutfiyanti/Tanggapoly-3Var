// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dwodwdtzggekxmpktbbs.supabase.co'; // 👈 Ganti ini pake URL yang tadi lu copy
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b2R3ZHR6Z2dla3htcGt0YmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzEwOTUsImV4cCI6MjA3NTE0NzA5NX0.2PHQheu0q9BGUrZurQZqG4fHyf3doBdQh5xRrH_K4Dk'; // 👈 Ganti ini pake Kunci yang tadi lu copy

export const supabase = createClient(supabaseUrl, supabaseAnonKey);