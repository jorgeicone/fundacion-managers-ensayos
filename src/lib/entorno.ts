/**
 * En qué entorno corre esta copia del sitio.
 *
 * Existen dos, servidos por el mismo código desde dos repositorios:
 *
 *   - **producción** → fundacionmanagers.com, lee la edición real.
 *   - **ensayos**    → una réplica para probar cambios sin tocar lo de verdad.
 *
 * Lo único que los separa son tres variables de entorno que se fijan en el
 * momento de compilar. No hay un `if (produccion)` desperdigado por el
 * código: quien necesita saberlo pregunta aquí.
 *
 * DECISIÓN DE DISEÑO: el aislamiento entre los dos es por `edicion`, no por
 * base de datos. Todas las tablas del torneo ya llevaban esa columna, así
 * que la réplica escribe en una edición sandbox y la real ni se entera.
 * Cargar un marcador en ensayos no puede tocar un dato de producción aunque
 * alguien se equivoque de pestaña.
 *
 * Lo que NO aísla: el esquema. Una migración afecta a las dos ediciones,
 * porque la base es la misma. Para probar un cambio de tablas de verdad
 * destructivo haría falta un proyecto Supabase aparte.
 */

import { EDICION_ACTUAL } from './liga';

/** 'produccion' o 'ensayos'. Sin variable, producción: el caso seguro. */
export const ENTORNO: 'produccion' | 'ensayos' =
  process.env.NEXT_PUBLIC_ENTORNO === 'ensayos' ? 'ensayos' : 'produccion';

export const ES_ENSAYOS = ENTORNO === 'ensayos';

/**
 * Edición de la que se leen y en la que se escriben los datos.
 *
 * Ojo con la diferencia respecto a `EDICION_ACTUAL`: esa es la que se
 * *muestra* —«4ª edición», en los títulos— y no cambia entre entornos,
 * porque la réplica es una copia de esa misma edición. Esta es la que va en
 * el `where` de las consultas.
 */
export const EDICION_DATOS: number = Number(process.env.NEXT_PUBLIC_EDICION) || EDICION_ACTUAL;

/**
 * Cómo se llama esta copia por ahí fuera. Lo usa el aviso de la cabecera;
 * en producción no lo lee nadie.
 */
export const NOMBRE_ENTORNO = ES_ENSAYOS ? 'Sitio de ensayos' : 'Producción';
