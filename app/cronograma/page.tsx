import { Card } from "@/components/ui/card";

export default function CronogramaPage() {
  return (
    <Card>
      <h1 className="mb-2 text-lg font-semibold">Cronograma (Ventas y Operaciones)</h1>
      <p className="mb-3 text-sm text-muted-foreground">
        Vista Kanban/Calendario responsive para visitas a clientes: cliente, fecha, estatus y empleado asignado.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/70 p-3">
          <p className="mb-2 text-sm font-semibold">Pendiente</p>
          <div className="rounded-md bg-muted p-2 text-xs">Visita: Grupo Delta - 2026-04-24</div>
        </div>
        <div className="rounded-lg border border-border/70 p-3">
          <p className="mb-2 text-sm font-semibold">En Progreso</p>
          <div className="rounded-md bg-muted p-2 text-xs">Visita: Comercio Norte - 2026-04-22</div>
        </div>
        <div className="rounded-lg border border-border/70 p-3">
          <p className="mb-2 text-sm font-semibold">Completada</p>
          <div className="rounded-md bg-muted p-2 text-xs">Visita: Inmobiliaria Sur - 2026-04-21</div>
        </div>
      </div>
    </Card>
  );
}
