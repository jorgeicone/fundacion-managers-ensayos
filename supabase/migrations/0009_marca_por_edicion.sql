-- ============================================================
-- La marca de cambios, separada por edicion.
-- Aplicada en el proyecto fundacion-managers el 22/09/2026.
--
-- `torneo_marca` (migracion 0006) resume TODO el torneo en una sola
-- fila. Funcionaba mientras hubo un solo sitio, pero ahora hay dos
-- —produccion sobre la edicion real y el sitio de ensayos sobre una
-- edicion sandbox— y comparten base.
--
-- Con la vista global, cargar un marcador de prueba movia la marca
-- que mira produccion: el cron veia "algo cambio" y recompilaba la
-- web real cada quince minutos sin que hubiera cambiado nada suyo. Y
-- al reves: el panel de ensayos diria "hay cambios sin publicar"
-- porque alguien toco la edicion de verdad.
--
-- Esta vista agrupa por edicion. Cada sitio consulta la suya y no se
-- entera de la otra.
--
-- `equipos` no lleva edicion —son los mismos ocho clubes y su escudo
-- es un archivo del repositorio—, asi que su marca se suma a todas
-- las ediciones por igual: si alguien renombra un club, los dos
-- sitios tienen que republicar, que es justo lo correcto.
--
-- Se deja `torneo_marca` como estaba: la usa lo que todavia no
-- conoce las ediciones, y borrarla romperia despliegues en vuelo.
-- ============================================================

create or replace view public.torneo_marca_edicion
with (security_invoker = true) as
with ediciones as (
  select edicion from public.partidos
  union
  select edicion from public.disciplina
  union
  select edicion from public.goleadores
),
equipos_marca as (
  select
    coalesce(max(actualizado_en), 'epoch'::timestamptz) as ultimo_cambio,
    count(*)                                            as filas
  from public.equipos
)
select
  e.edicion,
  greatest(
    coalesce((select max(p.actualizado_en) from public.partidos   p where p.edicion = e.edicion), 'epoch'::timestamptz),
    coalesce((select max(d.actualizado_en) from public.disciplina d where d.edicion = e.edicion), 'epoch'::timestamptz),
    coalesce((select max(g.actualizado_en) from public.goleadores g where g.edicion = e.edicion), 'epoch'::timestamptz),
    eq.ultimo_cambio
  ) as ultimo_cambio,
  (select count(*) from public.partidos   p where p.edicion = e.edicion)
  + (select count(*) from public.disciplina d where d.edicion = e.edicion)
  + (select count(*) from public.goleadores g where g.edicion = e.edicion)
  + eq.filas as filas
from ediciones e
cross join equipos_marca eq;

comment on view public.torneo_marca_edicion is
  'Igual que torneo_marca pero por edicion, para que produccion y el sitio de ensayos no se disparen despliegues entre si.';

grant select on public.torneo_marca_edicion to anon, authenticated;
