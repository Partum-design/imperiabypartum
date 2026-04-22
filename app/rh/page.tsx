import { Card } from "@/components/ui/card";

export default function RhPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h1 className="mb-2 text-lg font-semibold">Expedientes de Empleados</h1>
        <p className="text-sm text-muted-foreground">
          Modulo para gestionar perfiles, documentos de expediente y trazabilidad de cambios.
        </p>
      </Card>
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Nominas</h2>
        <p className="text-sm text-muted-foreground">
          Historial de recibos por empleado, carga de PDF y validacion por periodo de pago.
        </p>
      </Card>
    </div>
  );
}
