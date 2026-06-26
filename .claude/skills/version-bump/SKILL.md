---
name: version-bump
description: Bump the playwright-fixture-for-plugins package version in package.json and keep package-lock.json in sync. Use when releasing a new version of the library.
---

# Version bump (playwright-fixture-for-plugins)

The version lives in **`package.json` (`"version"`)** and is mirrored in
**`package-lock.json`** (in two places). Bumping `package.json` without
re-syncing the lockfile leaves the repo inconsistent — the recent history shows
this done as a dedicated chore (`chore: bump version to X.Y.Z`).

This is a source-only library with no build step; a "release" is a version
commit plus a git tag.

## Sources of truth

1. **`package.json`** — `"version": "X.Y.Z"`.
2. **`package-lock.json`** — the top-level `"version"` and the root package entry
   `packages[""].version`. Both must equal `package.json`'s version. Do not edit
   the lockfile by hand; regenerate it (step 4).

## Procedure

Given a target version `X.Y.Z`:

1. **Confirm current and target.** Read the current `package.json` `"version"`
   and verify `package-lock.json` already agrees. If they differ, surface the
   mismatch before bumping — that is a pre-existing inconsistency, not something
   to paper over.

2. **Decide the bump** (semver): patch for fixes, minor for backwards-compatible
   additions, major for breaking changes. Treat any change to an exported class
   name or constructor signature in `src/index.js` as **breaking** (downstream
   test suites extend these). If the user did not specify, ask.

3. **Update `package.json`** — set `"version"` to `X.Y.Z`.

4. **Sync the lockfile** — run `npm install --package-lock-only` (rewrites
   `package-lock.json`'s version fields without touching `node_modules`). Avoid
   `npm version`, which also creates a tag/commit and bypasses this flow.

5. **Verify both files agree** — `package.json` `"version"`, the lockfile's
   top-level `"version"`, and `packages[""].version` must be byte-identical.

## Tagging / release

Commit and tag only when the user asks to release:

- Commit the bump with the `sq-git:commit` skill (e.g. `chore: bump version to X.Y.Z`).
- The tag convention is the **bare version** `X.Y.Z` (no `v` prefix) — match the
  existing tags (`git tag`).

## Checklist

- [ ] `package.json` `"version"` = `X.Y.Z`
- [ ] `package-lock.json` top-level `"version"` = `X.Y.Z`
- [ ] `package-lock.json` `packages[""].version` = `X.Y.Z`
- [ ] Lockfile regenerated with `npm install --package-lock-only`, not hand-edited
- [ ] Bump is the correct semver level (breaking = exported API change)
