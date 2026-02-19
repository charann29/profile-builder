-- Create the templates table
create table if not exists templates (
  id text primary key,
  name text not null,
  description text,
  thumbnail text,
  features text[],
  category text, 
  dimensions jsonb, -- {width, height}
  html text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (Row Level Security) if you want to restrict access
-- For now, we'll allow public read access
alter table templates enable row level security;

create policy "Public templates are viewable by everyone"
  on templates for select
  using ( true );

-- For Admin API (Service Role) to properly work, we usually rely on specific keys.
-- But if using client-side auth, we'd need policies for insert/update/delete.
-- Assuming Admin API uses Service Role Key (backend), it bypasses RLS.
