import { FlaskConical } from 'lucide-react';
import { EDICION_DATOS, ES_ENSAYOS } from '@/lib/entorno';

/**
 * Franja fija que grita «esto no es el sitio real».
 *
 * Por qué es tan fea a propósito: el peor fallo posible de un entorno de
 * ensayos es que alguien cargue ahí el marcador de un partido de verdad,
 * lo dé por publicado y se entere el lunes. Una réplica idéntica a la real
 * invita justo a ese error. Naranja, fija arriba y en todas las páginas
 * —también en el panel— sale más barato que el susto.
 *
 * En producción no renderiza nada: ni un div vacío.
 */
export function AvisoEnsayos() {
  if (!ES_ENSAYOS) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-naranja px-4 py-2 text-center text-carbon"
    >
      <FlaskConical size={15} className="shrink-0" aria-hidden />
      <span className="font-bufon text-xs font-bold uppercase tracking-[0.15em]">
        Sitio de ensayos
      </span>
      <span className="text-[11px] font-medium">
        Nada de lo que hagas aquí toca la web real. Los datos son una copia (edición {EDICION_DATOS}
        ).
      </span>
      <a
        href="https://fundacionmanagers.com"
        className="text-[11px] font-bold underline underline-offset-2 hover:opacity-70"
      >
        Ir al sitio real
      </a>
    </div>
  );
}
