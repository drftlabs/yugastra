-- Run once in Supabase (SQL editor). Adds product tags and the short Hindi line shown beside the photo.
alter table products add column if not exists tags jsonb default '[]'::jsonb, add column if not exists hindi_line text;
