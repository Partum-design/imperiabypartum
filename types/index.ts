export type AppRole =
  | "superadmin"
  | "rh"
  | "ventas"
  | "desarrollo"
  | "diseno"
  | "grabacion"
  | "empleado_general";

export interface DashboardBirthday {
  id: string;
  fullName: string;
  birthday: string;
  role: AppRole;
}

export interface DashboardEvent {
  id: string;
  title: string;
  startAt: string;
  location: string;
}

export interface DashboardPost {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
}
