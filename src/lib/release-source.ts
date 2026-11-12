/**
 * Where this deployment gets release information from (version checks,
 * the update banner, self-update, and the /changelog page).
 *
 * Set RELEASES_REPO="owner/repo" to enable these features against that
 * GitHub repository's releases. When unset (or invalid), they are disabled,
 * so a fork never prompts admins to "update" to someone else's releases.
 */

const REPO_PATTERN = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

export function getReleasesRepo(): string | null {
  const repo = process.env.RELEASES_REPO?.trim();
  return repo && REPO_PATTERN.test(repo) ? repo : null;
}

export function isHostedDeployment(): boolean {
  return !!process.env.VERCEL || process.env.HOSTED === "true";
}

/** Version checks and self-update only run self-hosted with a releases repo. */
export function isUpdateCheckEnabled(): boolean {
  return !isHostedDeployment() && getReleasesRepo() !== null;
}

/** GitHub REST URL under the releases repo, e.g. "/releases/latest". */
export function releasesApiUrl(path: string): string | null {
  const repo = getReleasesRepo();
  return repo ? `https://api.github.com/repos/${repo}${path}` : null;
}

export function changelogUrl(): string | null {
  const repo = getReleasesRepo();
  return repo ? `https://github.com/${repo}/blob/main/CHANGELOG.md` : null;
}
