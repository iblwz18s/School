
-- RESET RLS POLICIES (Fixes "Data goes away" issue)

-- 1. Drop existing policies to start fresh
drop policy if exists "Public Access Students" on students;
drop policy if exists "Public Access Records" on student_records;

-- 2. Ensure RLS is enabled
alter table students enable row level security;
alter table student_records enable row level security;

-- 3. Create Permissive Policies for Anon Key
-- This allows SELECT, INSERT, UPDATE, DELETE for everyone (since we have no auth)

create policy "Enable ALL for students"
on students
for all
using (true)
with check (true);

create policy "Enable ALL for student_records"
on student_records
for all
using (true)
with check (true);
