/**
 * Refuses to build a store-bound app that points nowhere.
 *
 * EXPO_PUBLIC_* values are inlined into the JavaScript bundle at build time, so
 * a wrong URL cannot be corrected after the fact — it ships, the app cannot
 * reach a backend, and the fix is a new store release. This runs as an EAS
 * pre-install hook and stops that before it costs a review cycle.
 */
const profile = process.env.EAS_BUILD_PROFILE ?? '';
const url = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();

// Local and internal builds are expected to talk to a machine on the network.
const STORE_PROFILES = ['production', 'preview'];
if (!STORE_PROFILES.includes(profile)) {
  console.log(`[api-url] profile "${profile || 'local'}" — check skipped.`);
  process.exit(0);
}

const problems = [];
if (url === '') {
  problems.push('EXPO_PUBLIC_API_URL is not set.');
} else {
  if (!/^https:\/\//i.test(url)) {
    problems.push(`must start with https:// — got "${url}".`);
  }
  if (/localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+|example\.com/i.test(url)) {
    problems.push(`points at a placeholder or a local address — got "${url}".`);
  }
}

if (problems.length > 0) {
  console.error('\n[api-url] This build would ship an app that cannot reach its backend.\n');
  for (const problem of problems) console.error(`  · ${problem}`);
  console.error(`
  Set it once for the project, then rebuild:

    eas env:create --name EXPO_PUBLIC_API_URL --value https://api.your-domain.com \\
      --environment production --visibility plaintext

  The value is a public URL, not a secret: the app only ever talks to this
  backend, and the AI credentials stay on the server.
`);
  process.exit(1);
}

console.log(`[api-url] ${profile} build will use ${url}`);
