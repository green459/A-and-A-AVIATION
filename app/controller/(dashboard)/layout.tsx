import { requireAdmin } from "@/lib/auth/session";
import {
  getUnreadNotificationCount,
  getRecentNotifications,
} from "@/lib/data/notifications";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [admin, unreadCount, recentNotifications] = await Promise.all([
    requireAdmin(),
    getUnreadNotificationCount(),
    getRecentNotifications(6),
  ]);

  return (
    <DashboardShell
      adminName={admin.name}
      adminEmail={admin.email}
      unreadCount={unreadCount}
      recentNotifications={recentNotifications}
    >
      {children}
    </DashboardShell>
  );
}
