-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "itemSidebarCollapsed" BOOLEAN NOT NULL DEFAULT false,
    "emailOnNewItem" BOOLEAN NOT NULL DEFAULT false,
    "emailOnOutbid" BOOLEAN NOT NULL DEFAULT false,
    "emailOnItemWon" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_settings" ("createdAt", "emailOnItemWon", "emailOnNewItem", "emailOnOutbid", "id", "itemSidebarCollapsed", "updatedAt", "userId") SELECT "createdAt", "emailOnItemWon", "emailOnNewItem", "emailOnOutbid", "id", "itemSidebarCollapsed", "updatedAt", "userId" FROM "user_settings";
DROP TABLE "user_settings";
ALTER TABLE "new_user_settings" RENAME TO "user_settings";
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- FHU: the winner email carries payment & pickup instructions, so turn it on
-- for existing users too (it was opt-in before).
UPDATE "user_settings" SET "emailOnItemWon" = 1;
