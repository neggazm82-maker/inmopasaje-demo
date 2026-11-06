-- Da permiso de panel a un usuario. Cambia el email y el nombre, y ejecútalo.
-- (Antes crea el usuario en Authentication → Users → Add user.)
insert into public.equipo (email, nombre) values ('gerente@ejemplo.com', 'Gerente')
on conflict (email) do update set nombre = excluded.nombre;

-- Para quitarle el permiso a alguien:
-- delete from public.equipo where email = 'persona@ejemplo.com';
