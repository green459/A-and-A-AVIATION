"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Bell, CheckCheck, ChevronLeft } from "lucide-react";
import { NAV_ITEMS, PROFILE_NAV_ITEM } from "./nav-items";
import { logout } from "./logout-action";
import {
  openNotification,
  markAllNotificationsRead,
} from "./notifications/actions";
import type { Notification } from "@/lib/generated/prisma/client";

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";

function NavLink({
  item,
  active,
  onClick,
  collapsed,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
        collapsed ? "justify-center" : "gap-3"
      } ${
        active
          ? "bg-navy text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-navy"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function DashboardShell({
  adminName,
  adminEmail,
  unreadCount,
  recentNotifications,
  children,
}: {
  adminName: string;
  adminEmail: string;
  unreadCount: number;
  recentNotifications: Notification[];
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/controller";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Read the saved preference after mount (not during render) so the
  // server-rendered markup and the first client render match — avoids a
  // hydration mismatch, at the cost of one animation frame where the
  // sidebar is briefly expanded before snapping to the saved state.
  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    // One-time sync from localStorage on mount, which can only be read
    // client-side — there's no external-store subscription to model this as.
    if (stored === "true") setCollapsed(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  useEffect(() => {
    if (!notifOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotifOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notifOpen]);

  const isActive = (href: string) =>
    href === "/controller" ? pathname === href : pathname.startsWith(href);

  function renderSidebarContent(sidebarCollapsed: boolean) {
    return (
      <>
        <Link
          href="/controller"
          className={`flex items-center px-2 py-1 ${sidebarCollapsed ? "justify-center" : ""}`}
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src={
              sidebarCollapsed
                ? "/assets/AAAviation_Icon.svg"
                : "/assets/AAAviation_LOGO_Main_OB.svg"
            }
            alt="AAA Aviation Logo"
            width={sidebarCollapsed ? 32 : 132}
            height={sidebarCollapsed ? 32 : 50}
            className={sidebarCollapsed ? "h-8 w-8" : "h-9 w-auto"}
          />
        </Link>

        <nav
          className={`mt-8 flex ${sidebarCollapsed ? "justify-center" : "flex-1"} flex-col gap-1`}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onClick={() => setMobileOpen(false)}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-gray-200 pt-4">
          <NavLink
            item={PROFILE_NAV_ITEM}
            active={isActive(PROFILE_NAV_ITEM.href)}
            onClick={() => setMobileOpen(false)}
            collapsed={sidebarCollapsed}
          />
          <form action={logout}>
            <button
              type="submit"
              title={sidebarCollapsed ? "Sign out" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  sidebarCollapsed
                    ? "max-w-0 opacity-0"
                    : "max-w-40 opacity-100"
                }`}
              >
                Sign out
              </span>
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-gray-200 bg-white p-4 transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {renderSidebarContent(collapsed)}

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-navy lg:flex"
        >
          <ChevronLeft
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-ink/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-72 flex-col bg-white p-4 shadow-card-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            {renderSidebarContent(false)}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex items-center border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((open) => !open)}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-menu">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-navy">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <form action={markAllNotificationsRead}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-navy"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      </form>
                    )}
                  </div>

                  {recentNotifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-400">
                      No notifications yet.
                    </p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                      {recentNotifications.map((notification) => (
                        <li key={notification.id}>
                          <form action={openNotification}>
                            <input
                              type="hidden"
                              name="id"
                              value={notification.id}
                            />
                            {notification.inquiryId && (
                              <input
                                type="hidden"
                                name="inquiryId"
                                value={notification.inquiryId}
                              />
                            )}
                            <button
                              type="submit"
                              className={`flex w-full items-start gap-2.5 px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                                notification.isRead ? "" : "bg-blue-50/50"
                              }`}
                            >
                              {!notification.isRead && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block text-gray-700">
                                  {notification.message}
                                </span>
                                <span className="mt-0.5 block text-xs text-gray-400">
                                  {timeAgo(notification.createdAt)}
                                </span>
                              </span>
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href="/controller/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block border-t border-gray-100 px-4 py-2.5 text-center text-sm font-medium text-navy hover:bg-gray-50"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{adminName}</p>
              <p className="text-xs text-gray-500">{adminEmail}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
