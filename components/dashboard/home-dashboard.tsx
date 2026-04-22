"use client";

import { motion } from "framer-motion";
import { CalendarDays, Cake, Send, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardBirthday, DashboardEvent, DashboardPost } from "@/types";

const posts: DashboardPost[] = [
  {
    id: "1",
    title: "Actualizacion de Branding Q2",
    body: "El nuevo kit visual ya esta aprobado. Se libera el lunes con assets centralizados en Supabase Storage.",
    author: "Direccion de Diseno",
    createdAt: "Hace 2 horas",
  },
  {
    id: "2",
    title: "Politica de Vacaciones",
    body: "RH publico la nueva politica de aprobaciones y calendario de cobertura por area.",
    author: "Recursos Humanos",
    createdAt: "Ayer",
  },
];

const birthdays: DashboardBirthday[] = [
  { id: "1", fullName: "Ana Ruiz", birthday: "2026-04-24", role: "diseno" },
  { id: "2", fullName: "Jorge Lopez", birthday: "2026-04-26", role: "ventas" },
  { id: "3", fullName: "Mario Santos", birthday: "2026-04-30", role: "desarrollo" },
];

const events: DashboardEvent[] = [
  { id: "1", title: "Townhall Mensual", startAt: "2026-04-25 11:00", location: "Sala Principal" },
  { id: "2", title: "Workshop de Ventas", startAt: "2026-04-27 09:30", location: "Aula B" },
  { id: "3", title: "Demo de Producto", startAt: "2026-04-29 16:00", location: "Meet Online" },
];

const expirations = [
  { id: "1", name: "partum.mx", daysLeft: 45 },
  { id: "2", name: "Adobe CC Team", daysLeft: 21 },
  { id: "3", name: "Host Primario", daysLeft: 4 },
];

function getExpirationTone(daysLeft: number): "green" | "yellow" | "red" {
  if (daysLeft <= 5) return "red";
  if (daysLeft <= 30) return "yellow";
  return "green";
}

export function HomeDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <Card className="animate-fade-up">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard Principal</h1>
            <Badge tone="green">Operacion Activa</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Centro de control de Imperia By Partum para comunicados, eventos, vencimientos y gestion diaria.
          </p>
        </Card>

        <Card className="animate-fade-up [animation-delay:120ms]">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold">Dashboard de Vencimientos</h2>
          </div>
          <div className="space-y-2">
            {expirations.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                <p className="text-sm">{item.name}</p>
                <Badge tone={getExpirationTone(item.daysLeft)}>{item.daysLeft} dias</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up [animation-delay:180ms]">
          <h2 className="mb-3 font-semibold">Feed de Publicaciones</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/70 bg-background/70 p-3"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{post.title}</h3>
                  <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground">{post.body}</p>
                <p className="mt-2 text-xs font-medium">{post.author}</p>
              </motion.article>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="animate-fade-up [animation-delay:240ms]">
          <div className="mb-3 flex items-center gap-2">
            <Cake className="h-4 w-4 text-pink-500" />
            <h2 className="font-semibold">Proximos Cumpleanos</h2>
          </div>
          <div className="space-y-2">
            {birthdays.map((person) => (
              <div key={person.id} className="rounded-lg border border-border/70 p-3">
                <p className="text-sm font-medium">{person.fullName}</p>
                <p className="mb-2 text-xs text-muted-foreground">{person.birthday}</p>
                <Button className="h-8 text-xs">
                  <Send className="mr-1 h-3 w-3" />
                  Enviar Felicitacion
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up [animation-delay:300ms]">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <h2 className="font-semibold">Proximos Eventos</h2>
          </div>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-lg border border-border/70 p-3">
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.startAt}</p>
                <p className="text-xs text-muted-foreground">{event.location}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
