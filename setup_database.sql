
-- 1. Create Students Table
create table if not exists students (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  phone text,
  base_score integer default 80
);

-- 2. Create Student Records Table
create table if not exists student_records (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  student_id uuid references students(id) on delete cascade,
  type text not null, -- 'POSITIVE' or 'NEGATIVE'
  date timestamp with time zone default now(),
  details text,
  points integer,
  observer text,
  procedure_applied text,
  violation_id text
);

-- 3. Enable RLS (Recommended by Supabase)
alter table students enable row level security;
alter table student_records enable row level security;

-- 4. Create Policies (Allow public access since we are using Anon key for this simple app)
-- Note: In a real production app with auth, you would restrict these.
create policy "Public Access Students" on students for all using (true) with check (true);
create policy "Public Access Records" on student_records for all using (true) with check (true);
