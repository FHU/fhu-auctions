import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/theme-provider";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MobileNotificationSheet } from "@/components/notifications/mobile-notification-sheet";
import { UserAvatar } from "@/components/ui/user-avatar";
import { BrandLockup } from "@/components/common/BrandLockup";
import packageJson from "../../../package.json";
import { brand, supportMailto } from "@/config/brand";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAppContext } from "@/contexts/AppContext";

interface NavbarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);

  const { unreadCount } = useNotifications();
  const { isUserAuctionAdmin, isSiteAdmin } = useAppContext();

  useEffect(() => {
    // This is an intentional hydration pattern to prevent SSR mismatch
    setMounted(true); // eslint-disable-line
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-fhu-maroon text-white border-b-4 border-fhu-gold py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            aria-label={tCommon("appName")}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <BrandLockup variant="white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="btn btn-ghost btn-sm font-semibold text-white hover:text-fhu-gold hover:bg-white/10 border-none gap-1.5"
            >
              <span className="icon-[tabler--layout-dashboard] size-4"></span>
              {t("dashboard")}
            </Link>
            <Link
              href="/listings"
              className="btn btn-ghost btn-sm font-semibold text-white hover:text-fhu-gold hover:bg-white/10 border-none gap-1.5"
            >
              <span className="icon-[tabler--tag] size-4"></span>
              {t("myListings")}
            </Link>
            <Link
              href="/history"
              className="btn btn-ghost btn-sm font-semibold text-white hover:text-fhu-gold hover:bg-white/10 border-none gap-1.5"
            >
              <span className="icon-[tabler--gavel] size-4"></span>
              {t("myBids")}
            </Link>
            {isUserAuctionAdmin && (
              <Link
                href="/auctions/admin"
                className="btn btn-ghost btn-sm font-semibold text-fhu-gold hover:text-white hover:bg-white/10 border-none gap-1.5"
              >
                <span className="icon-[tabler--shield-check] size-4"></span>
                {t("adminPanel")}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Notification Bell */}
        <button
          onClick={() => setMobileNotificationsOpen(true)}
          className="md:hidden btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10 border-none"
          aria-label={t("notifications")}
        >
          <div className="indicator">
            <span className="icon-[tabler--bell] size-6"></span>
            {unreadCount > 0 && (
              <span className="indicator-item badge badge-accent badge-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </button>

        <div className="hidden md:flex items-center gap-3">
          {/* Notifications */}
          <div className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/10 border-none">
            <NotificationBell />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/10 border-none"
              onClick={() =>
                setTheme(resolvedTheme === "light" ? "dark" : "light")
              }
              aria-label="Toggle theme"
            >
              {resolvedTheme === "light" ? (
                <span className="icon-[tabler--moon] size-5"></span>
              ) : (
                <span className="icon-[tabler--sun] size-5"></span>
              )}
            </button>
          )}

          {/* User Menu */}
          <div className="dropdown dropdown-end ml-2">
            <button
              tabIndex={0}
              className="group flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <UserAvatar name={user.name} email={user.email} size="sm" />
              <span className="icon-[tabler--chevron-down] size-4 text-white/70 group-hover:text-white transition-colors"></span>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-base-content z-50 mt-4 w-60 p-2 border border-base-300 border-t-4 border-t-fhu-gold transform origin-top-right transition-all"
            >
              <li className="menu-title px-4 py-3 border-b border-base-content/5 mb-2">
                <span className="text-xs font-semibold text-primary block mb-0.5">
                  {t("signedInAs")}
                </span>
                <span className="text-sm font-normal text-base-content/80 truncate block">
                  {user.email}
                </span>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="active:bg-primary/10 active:text-primary"
                >
                  <span className="icon-[tabler--layout-dashboard] size-4 opacity-70"></span>
                  {t("dashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="active:bg-primary/10 active:text-primary"
                >
                  <span className="icon-[tabler--history] size-4 opacity-70"></span>
                  {t("bidHistory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="active:bg-primary/10 active:text-primary"
                >
                  <span className="icon-[tabler--settings] size-4 opacity-70"></span>
                  {t("settings")}
                </Link>
              </li>
              {isUserAuctionAdmin && (
                <li>
                  <Link
                    href="/auctions/admin"
                    className="text-warning active:bg-warning/10 active:text-warning"
                  >
                    <span className="icon-[tabler--shield-check] size-4"></span>
                    {t("adminPanel")}
                  </Link>
                </li>
              )}
              {isSiteAdmin && (
                <li>
                  <Link
                    href="/admin/users"
                    className="active:bg-primary/10 active:text-primary"
                  >
                    <span className="icon-[tabler--users] size-4 opacity-70"></span>
                    {t("manageUsers")}
                  </Link>
                </li>
              )}
              <div className="divider my-1 opacity-50"></div>
              {brand.helpUrl && (
                <li>
                  <a
                    href={brand.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="active:bg-primary/10 active:text-primary"
                  >
                    <span className="icon-[tabler--book] size-4 opacity-70"></span>
                    {t("documentation")}
                  </a>
                </li>
              )}
              {supportMailto && (
                <li>
                  <a
                    href={supportMailto}
                    className="active:bg-primary/10 active:text-primary"
                  >
                    <span className="icon-[tabler--mail] size-4 opacity-70"></span>
                    {t("feedback")}
                  </a>
                </li>
              )}
              {(brand.helpUrl || supportMailto) && (
                <div className="divider my-1 opacity-50"></div>
              )}
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-error hover:bg-error/10 hover:text-error active:bg-error/20"
                >
                  <span className="icon-[tabler--logout] size-4"></span>
                  {t("signOut")}
                </button>
              </li>
              <li className="menu-title mt-1 text-center">
                <span className="text-[10px] text-base-content/30 font-mono">
                  v{packageJson.version}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Notification Sheet */}
      <MobileNotificationSheet
        isOpen={mobileNotificationsOpen}
        onClose={() => setMobileNotificationsOpen(false)}
      />
    </nav>
  );
}
