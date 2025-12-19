import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fitusssbcamruhubveso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdHVzc3NiY2FtcnVodWJ2ZXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTQ4NDksImV4cCI6MjA4MTU3MDg0OX0.XGBg0ilL6lyhrNDiXwogNI90VSw-_i0OVBg1Uo39r7s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { count, error } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed:', error.message);
            if (error.code) console.error('Error code:', error.code);
        } else {
            console.log('✅ Connection successful!');
            console.log(`Found ${count} records in 'students' table.`);
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testConnection();
