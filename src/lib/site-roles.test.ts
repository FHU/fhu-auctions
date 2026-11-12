import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseAdminEmails,
  isEnvSiteAdmin,
  effectiveSiteRole,
  canCreateAuctions,
  isSiteAdminRole,
} from "./site-roles";

test("parseAdminEmails trims, lowercases, and drops blanks", () => {
  const set = parseAdminEmails(" Admin@FHU.edu, ,second@example.com ,");
  assert.deepEqual([...set], ["admin@fhu.edu", "second@example.com"]);
  assert.equal(parseAdminEmails(undefined).size, 0);
});

test("env admins match case-insensitively", () => {
  const admins = parseAdminEmails("admin@fhu.edu");
  assert.equal(isEnvSiteAdmin("ADMIN@fhu.edu", admins), true);
  assert.equal(isEnvSiteAdmin("other@fhu.edu", admins), false);
  assert.equal(isEnvSiteAdmin(null, admins), false);
});

test("SITE_ADMIN_EMAILS overrides the stored role", () => {
  const admins = parseAdminEmails("admin@fhu.edu");
  assert.equal(
    effectiveSiteRole("admin@fhu.edu", "USER", admins),
    "SITE_ADMIN",
  );
  assert.equal(effectiveSiteRole("user@fhu.edu", "USER", admins), "USER");
  assert.equal(
    effectiveSiteRole("org@fhu.edu", "ORGANIZER", admins),
    "ORGANIZER",
  );
});

test("only organizers and site admins can create auctions", () => {
  assert.equal(canCreateAuctions("USER"), false);
  assert.equal(canCreateAuctions("ORGANIZER"), true);
  assert.equal(canCreateAuctions("SITE_ADMIN"), true);
  assert.equal(isSiteAdminRole("ORGANIZER"), false);
  assert.equal(isSiteAdminRole("SITE_ADMIN"), true);
});
