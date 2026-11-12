-- AlterTable
-- Site-wide role (USER | ORGANIZER | SITE_ADMIN); existing users start as USER.
ALTER TABLE "users" ADD COLUMN "siteRole" TEXT NOT NULL DEFAULT 'USER';
