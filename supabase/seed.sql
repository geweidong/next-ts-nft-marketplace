create table public.movies (
  id bigint generated always as identity primary key,
  name text not null,
  data jsonb null
);
