import { prisma } from "./prisma";

export const PROJECT_USER_SELECT = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  userType: true,
} as const;

export const projectInclude = {
  encargadas: { select: PROJECT_USER_SELECT },
  _count: { select: { interesadas: true, solicitudes: true } },
} as const;

export const solicitudInclude = {
  select: {
    id: true,
    estado: true,
    message: true,
    createdAt: true,
    decidedAt: true,
    userId: true,
    user: { select: PROJECT_USER_SELECT },
  },
  orderBy: { createdAt: "desc" as const },
};

export async function loadProjectEncargadaIds(id: string) {
  const project = await prisma.proyecto.findUnique({
    where: { id },
    select: {
      id: true,
      cupoMaximo: true,
      estado: true,
      fechaFin: true,
      encargadas: { select: { id: true } },
    },
  });
  if (!project) return null;
  return {
    id: project.id,
    cupoMaximo: project.cupoMaximo,
    estado: project.estado,
    fechaFin: project.fechaFin,
    encargadaIds: project.encargadas.map((e) => e.id),
  };
}

export async function countAccepted(proyectoId: string, excludeId?: string) {
  return prisma.proyectoSolicitud.count({
    where: {
      proyectoId,
      estado: "aceptada",
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}
