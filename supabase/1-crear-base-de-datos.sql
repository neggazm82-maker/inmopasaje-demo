-- =====================================================================
--  Inmobiliaria El Pasaje · Base de datos del panel /admin
--  Cómo usarlo: Supabase → SQL Editor → New query → pega TODO esto → Run.
--  Se puede ejecutar más de una vez sin romper nada.
-- =====================================================================

-- 1) EQUIPO: emails que pueden entrar en el panel -----------------------
create table if not exists public.equipo (
  email  text primary key,
  nombre text
);
alter table public.equipo enable row level security;
drop policy if exists "cada uno se ve a sí mismo" on public.equipo;
create policy "cada uno se ve a sí mismo" on public.equipo
  for select to authenticated using (lower(email) = lower(auth.jwt() ->> 'email'));

create or replace function public.es_equipo() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.equipo where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- 2) INMUEBLES -----------------------------------------------------------
create table if not exists public.inmuebles (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique not null,
  datos       jsonb not null,
  estado      text not null default 'disponible' check (estado in ('disponible', 'vendido', 'alquilado')),
  oculto      boolean not null default false,
  orden       integer not null default 0,
  creado      timestamptz not null default now(),
  actualizado timestamptz not null default now()
);
alter table public.inmuebles enable row level security;
drop policy if exists "la web ve los no ocultos" on public.inmuebles;
create policy "la web ve los no ocultos" on public.inmuebles
  for select to anon, authenticated using (not oculto or public.es_equipo());
drop policy if exists "el equipo crea" on public.inmuebles;
create policy "el equipo crea" on public.inmuebles for insert to authenticated with check (public.es_equipo());
drop policy if exists "el equipo edita" on public.inmuebles;
create policy "el equipo edita" on public.inmuebles for update to authenticated using (public.es_equipo()) with check (public.es_equipo());
drop policy if exists "el equipo borra" on public.inmuebles;
create policy "el equipo borra" on public.inmuebles for delete to authenticated using (public.es_equipo());

-- 3) SOLICITUDES (valoraciones, avísame y contacto) ---------------------
create table if not exists public.solicitudes (
  id        uuid primary key default gen_random_uuid(),
  tipo      text not null check (tipo in ('valoracion', 'avisame', 'contacto')),
  datos     jsonb not null,
  fotos     text[] not null default '{}',
  atendida  boolean not null default false,
  creado    timestamptz not null default now()
);
alter table public.solicitudes enable row level security;
drop policy if exists "cualquiera puede enviar" on public.solicitudes;
create policy "cualquiera puede enviar" on public.solicitudes
  for insert to anon, authenticated with check (atendida = false);
drop policy if exists "el equipo lee" on public.solicitudes;
create policy "el equipo lee" on public.solicitudes for select to authenticated using (public.es_equipo());
drop policy if exists "el equipo marca" on public.solicitudes;
create policy "el equipo marca" on public.solicitudes for update to authenticated using (public.es_equipo());
drop policy if exists "el equipo borra solicitudes" on public.solicitudes;
create policy "el equipo borra solicitudes" on public.solicitudes for delete to authenticated using (public.es_equipo());

-- 4) FOTOS ---------------------------------------------------------------
-- "fotos": las de los inmuebles (públicas). "solicitudes": las que mandan los propietarios (privadas).
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('solicitudes', 'solicitudes', false) on conflict (id) do nothing;

drop policy if exists "equipo sube fotos" on storage.objects;
create policy "equipo sube fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and public.es_equipo());
drop policy if exists "equipo borra fotos" on storage.objects;
create policy "equipo borra fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos' and public.es_equipo());
drop policy if exists "propietarios suben fotos" on storage.objects;
create policy "propietarios suben fotos" on storage.objects for insert to anon, authenticated with check (bucket_id = 'solicitudes');
drop policy if exists "equipo ve fotos de solicitudes" on storage.objects;
create policy "equipo ve fotos de solicitudes" on storage.objects for select to authenticated using (bucket_id = 'solicitudes' and public.es_equipo());
