import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { PageLayout, SEO } from "@/components/common";
import { useToast } from "@/components/ui/toast";
import { withAuth } from "@/lib/auth/withAuth";
import { getMessages, Locale } from "@/i18n";
import { fetcher } from "@/lib/fetcher";
import {
  getUserSiteRole,
  listUsersForAdmin,
  type SiteUserRow,
} from "@/lib/services/site-role.service";
import { SITE_ROLES, isSiteAdminRole } from "@/lib/site-roles";

type SiteRole = (typeof SITE_ROLES)[number];

interface ManageUsersPageProps {
  user: { id: string; name: string | null; email: string };
  initialUsers: SiteUserRow[];
}

export default function ManageUsersPage({
  user,
  initialUsers,
}: ManageUsersPageProps) {
  const t = useTranslations("siteAdmin");
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const query = search.trim();
  const { data, mutate } = useSWR<{ users: SiteUserRow[] }>(
    `/api/admin/users${query ? `?search=${encodeURIComponent(query)}` : ""}`,
    fetcher,
    {
      fallbackData: query ? undefined : { users: initialUsers },
      keepPreviousData: true,
    },
  );
  const users = data?.users ?? [];

  const changeRole = async (target: SiteUserRow, siteRole: SiteRole) => {
    setSavingId(target.id);
    try {
      const res = await fetch(`/api/admin/users/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteRole }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(body.message || t("updateFailed"), "error");
        return;
      }
      await mutate();
      showToast(
        t("roleUpdated", {
          name: target.name || target.email,
          role: t(`roles.${siteRole}`),
        }),
        "success",
      );
    } catch {
      showToast(t("updateFailed"), "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <SEO title={t("seoTitle")} noindex />
      <PageLayout user={user}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary">
            <span className="icon-[tabler--users] size-7"></span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-base-content/70">{t("subtitle")}</p>
          </div>
        </div>

        <ul className="grid gap-2 sm:grid-cols-3 mb-6 text-sm">
          {SITE_ROLES.map((role) => (
            <li
              key={role}
              className="border border-base-300 bg-base-100 px-4 py-3"
            >
              <span className="font-semibold">{t(`roles.${role}`)}</span>
              <span className="block text-base-content/70">
                {t(`roleHelp.${role}`)}
              </span>
            </li>
          ))}
        </ul>

        <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md mb-4">
          <span className="icon-[tabler--search] size-4 opacity-60"></span>
          <input
            type="search"
            className="grow"
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="overflow-x-auto border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>{t("columns.user")}</th>
                <th className="hidden sm:table-cell">{t("columns.joined")}</th>
                <th>{t("columns.role")}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-base-content/70">
                    {t("noUsers")}
                  </td>
                </tr>
              ) : (
                users.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="font-medium">
                        {row.name || row.email}
                        {row.id === user.id && (
                          <span className="badge badge-sm badge-ghost ml-2">
                            {t("you")}
                          </span>
                        )}
                      </div>
                      {row.name && (
                        <div className="text-sm text-base-content/70">
                          {row.email}
                        </div>
                      )}
                    </td>
                    <td className="hidden sm:table-cell text-sm text-base-content/70">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        className="select select-bordered select-sm w-40"
                        aria-label={`${t("columns.role")}: ${row.name || row.email}`}
                        value={row.siteRole}
                        disabled={
                          row.managedByEnv ||
                          row.id === user.id ||
                          savingId === row.id
                        }
                        onChange={(e) =>
                          changeRole(row, e.target.value as SiteRole)
                        }
                      >
                        {SITE_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {t(`roles.${role}`)}
                          </option>
                        ))}
                      </select>
                      {row.managedByEnv && (
                        <div className="text-xs text-base-content/70 mt-1">
                          {t("managedByEnv")}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PageLayout>
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  // Site admins only; everyone else gets a 404
  const siteRole = await getUserSiteRole(context.session.user.id);
  if (!isSiteAdminRole(siteRole)) {
    return { notFound: true };
  }

  const [messages, initialUsers] = await Promise.all([
    getMessages(context.locale as Locale),
    listUsersForAdmin({}),
  ]);

  return {
    props: {
      user: {
        id: context.session.user.id,
        name: context.session.user.name || null,
        email: context.session.user.email || "",
      },
      initialUsers,
      messages,
    },
  };
});
