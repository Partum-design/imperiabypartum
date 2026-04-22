import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const assets = [
  { name: "partum.mx", provider: "Cloudflare", days: 80 },
  { name: "M365 Business", provider: "Microsoft", days: 20 },
  { name: "Adobe Team", provider: "Adobe", days: 4 },
];

function tone(days: number): "green" | "yellow" | "red" {
  if (days <= 5) return "red";
  if (days <= 30) return "yellow";
  return "green";
}

export default function AssetsPage() {
  return (
    <Card>
      <h1 className="mb-3 text-lg font-semibold">Gestion de Activos (Dominios, Suscripciones y Licencias)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="pb-2">Nombre</th>
              <th className="pb-2">Proveedor</th>
              <th className="pb-2">Dias Restantes</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.name} className="border-t border-border/70">
                <td className="py-2">{asset.name}</td>
                <td className="py-2">{asset.provider}</td>
                <td className="py-2">{asset.days}</td>
                <td className="py-2"><Badge tone={tone(asset.days)}>{tone(asset.days)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
