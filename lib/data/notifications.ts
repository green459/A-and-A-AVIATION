import { prisma } from "@/lib/prisma";
import type { Notification } from "@/lib/generated/prisma/client";

export type { Notification };

export const getUnreadNotificationCount = () =>
  prisma.notification.count({ where: { isRead: false } });

export const getRecentNotifications = (limit: number): Promise<Notification[]> =>
  prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

export async function getNotificationsPage({
  page,
  pageSize,
  q,
}: {
  page: number;
  pageSize: number;
  q: string;
}): Promise<{ rows: Notification[]; totalItems: number }> {
  const where = q ? { message: { contains: q } } : {};

  const [rows, totalItems] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notification.count({ where }),
  ]);

  return { rows, totalItems };
}
