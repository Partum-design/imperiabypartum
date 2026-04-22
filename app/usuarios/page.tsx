import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const users = [
  { name: "Admin Partum", email: "admin@partum.mx", role: "superadmin", area: "Direccion" },
  { name: "Laura RH", email: "rh@partum.mx", role: "rh", area: "Recursos Humanos" },
  { name: "Carlos Ventas", email: "ventas@partum.mx", role: "ventas", area: "Ventas" },
];

export default function UsuariosPage() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Administracion de Usuarios (RBAC)</h1>
        <Badge>Data Table</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="pb-2">Nombre</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Rol</th>
              <th className="pb-2">Area</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-border/70">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2"><Badge tone="gray">{user.role}</Badge></td>
                <td className="py-2">{user.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
