
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fitusssbcamruhubveso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdHVzc3NiY2FtcnVodWJ2ZXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTQ4NDksImV4cCI6MjA4MTU3MDg0OX0.XGBg0ilL6lyhrNDiXwogNI90VSw-_i0OVBg1Uo39r7s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
