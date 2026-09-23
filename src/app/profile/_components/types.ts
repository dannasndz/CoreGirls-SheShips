export interface ProfileData {
  id: string;
  username: string;
  email: string;
  userType: string;
  fullName: string;
  birthDate: string;
  institution: string;
  accountStatus: string;
  isAdmin: boolean;
  avatarUrl: string | null;
  description: string | null;
  interests: string[];
  campus: string | null;
  carrera: string | null;
  semestre: number | null;
  clubs: string[];
  fechaIngresoAlumna: string | null;
  sector: string | null;
  areaSTEM: string | null;
  materias: string[];
  fechaInicioLabor: string | null;
  ocupacion: string | null;
  fechaIngreso: string | null;
  fechaEgreso: string | null;
  ubicacion: string | null;
  createdAt: string;
  updatedAt: string;
  certificados: CertificateItem[];
  practicas: PracticeItem[];
  proyectos: ProjectItem[];
  quizResult: {
    career: string;
    answers: unknown;
    createdAt: string;
  } | null;
  posts: PostItem[];
  groupMemberships: GroupMembership[];
  events: EventItem[];
  eventAttendances: { event: EventItem }[];
  _count: {
    posts: number;
    comments: number;
    likes: number;
    groupMemberships: number;
    events: number;
    eventAttendances: number;
  };
}

export interface CertificateItem {
  id: string;
  nombre: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface PracticeItem {
  id: string;
  empresa: string;
  area: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface ProjectItem {
  id: string;
  nombre: string;
  descripcion: string;
  areaSTEM: string | null;
  estado: string;
  anio: number | null;
  fecha: string | null;
  lugar: string | null;
  modalidad: string | null;
  cupoMaximo: number | null;
  perfilInteresadas: string | null;
  createdAt: string;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: string;
  _count: { likes: number; comments: number };
}

export interface GroupMembership {
  role: string;
  joinedAt: string;
  group: { id: string; name: string; description: string };
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  hour: string;
  modality: string;
  estado: string;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formatea fechas "solo día" (YYYY-MM-DD o ISO) sin desfase por zona horaria.
 * Usar para fechas de calendario (experiencias, eventos, ingreso/egreso), no
 * para timestamps como createdAt/uploadedAt.
 */
export function formatDateOnly(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const parts = dateStr.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return formatDate(dateStr);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
