# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`playwright-fixture-for-plugins` is a **pure JavaScript ES module library** (`"type": "module"`) of Playwright fixtures and Page Objects for end-to-end testing of [Integration-Core](https://github.com/sequra/integration-core) seQura plugins (WooCommerce, Magento, etc.).

It is **not an application and is not run on its own.** It is consumed by a downstream plugin's e2e test suite as a `github:` dependency:

```json
"devDependencies": {
  "playwright-fixture-for-plugins": "github:sequra/playwright-fixture-for-plugins"
}
```

The library ships **abstract base classes**: it provides the structure and shared behavior; each consuming repo subclasses the abstractions and implements the platform-specific details.

## Architecture

Abstract-base-class / Page Object Model. Everything descends from `Fixture` and is re-exported as a flat barrel from `src/index.js`.

- `src/base/Fixture.js` — root base class. Constructor takes `(page, baseURL, expect)`; exposes `initSelectors()` / `initLocators()` (override to return objects).
- `src/base/BackOffice.js` — admin-panel interface (`login`, `logout`, `gotoSeQuraSettings`, `gotoOrderListing`). Abstract methods `throw new Error('Not implemented')`.
- `src/base/SeQuraCheckoutForm.js` — seQura checkout-form interactions.
- `src/pages/Page.js` — base page object; adds `request` to the constructor and an abstract `goto()`.
- `src/pages/PageWithWidgets.js` → `ProductPage` / `CategoryPage` — page objects that assert seQura promotional widgets.
- `src/pages/*SettingsPage.js` — the seQura back-office settings screens (General, Connection, PaymentMethods, Widget, Advanced, Onboarding).
- `src/pages/CartPage.js`, `CheckoutPage.js` — storefront flow pages.
- `src/utils/DataProvider.js` — centralized test data (shoppers, payment methods, widget options) per country/scenario.
- `src/utils/SeQuraHelper.js` — webhook driver. Builds `?sq-webhook=…` URLs and executes them via Playwright's `request`; consumers register webhooks in `initWebhooks()`.
- `src/utils/types.js` — JSDoc `@typedef`s shared across the library.

Inheritance: `Fixture` ← `BackOffice` | `Page` | `DataProvider` | `SeQuraHelper`; `Page` ← `PageWithWidgets` ← `ProductPage`.

## Repository layout

```
src/
  base/    Fixture, BackOffice, SeQuraCheckoutForm
  pages/   Page, PageWithWidgets, settings + storefront page objects
  utils/   DataProvider, SeQuraHelper, types
  index.js Barrel: re-exports every public class
docs/      ADRs (docs/decisions/) and sensitive-data reference
README.md  Full consumer guide (setup, architecture, API reference)
```

## Commands

This repo has **no build, no in-repo test runner, no linter, and no CI quality workflow.** It is source-only JS published as-is.

- `npm install` — install dev dependencies (`@playwright/test` only).
- There is no `npm test`/`npm run build`/`npm run lint`. The `package.json` `"test"` script is an unconfigured placeholder; do not invoke it.
- Tests that exercise these fixtures live in the **consuming** repos and run there with Playwright (`npx playwright test`), not here.
- After cloning, see "Local setup" below for git-hook activation.

## Local setup

Run once after cloning to enable the shared git hooks:

```bash
./setup.sh
```

This sets `core.hooksPath=.githooks` (a local git setting, not applied automatically on clone). The shared hooks:
- `.githooks/pre-commit` — runs `node --check` on staged `.js`/`.mjs`/`.cjs` files; blocks the commit on a syntax error.
- `.githooks/post-commit` / `.githooks/post-checkout` — thin dispatchers that delegate to any per-developer hook of the same name under `.git/hooks/` (e.g. graphify's knowledge-graph rebuild), so `core.hooksPath` does not disable local hooks.

graphify is an optional, per-developer tool. Its config lives in the git-ignored `CLAUDE.local.md` and `.claude/settings.local.json`; its graph output lives in `graphify-out/` (excluded via `.git/info/exclude`). To enable local graph rebuilds: `graphify hook install`.

## Conventions

- **ES modules only** (`import`/`export`), one default-exported class per file.
- **JSDoc types** on constructors and public methods (`@param`, `@returns`); Playwright types via `import('@playwright/test')`.
- **Abstract methods** that subclasses must implement `throw new Error('Not implemented')` — keep that contract.
- Every new public class must be **re-exported from `src/index.js`**, or downstream repos cannot import it.
- Treat exported class names and constructor signatures as a **public API**: downstream test suites extend them, so changing or removing one is a breaking change — flag it.

## Adding a new page object / fixture

1. Create `src/pages/<Name>.js` (or `src/base/`), extending the closest existing base (`Page`, `PageWithWidgets`, `Fixture`, …).
2. Override only the methods this object needs; keep `throw new Error('Not implemented')` for what stays abstract.
3. Add JSDoc types matching the surrounding files.
4. Re-export it from `src/index.js`.

## Project skills

Repo-specific Claude Code skills live under `.claude/skills/`:
- `version-bump` — bump the package version and re-sync `package-lock.json` for a release.
- `page-object` — scaffold a new page object / fixture following the abstract-base-class conventions.

## Documentation

`README.md` is the authoritative consumer guide; keep it and this file consistent when commands or the public API change. Architectural decisions are recorded as ADRs under `docs/decisions/`.

## Working principles

Adapted from [Andrej Karpathy's guidelines](https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/refs/heads/main/CLAUDE.md). Favor caution over speed; use judgment for trivial tasks.

1. **Think before coding.** State assumptions instead of proceeding silently. When a request has multiple interpretations, surface them; suggest a simpler approach if one exists; ask before implementing when genuinely unsure.
2. **Simplicity first.** Minimum code that solves the problem — nothing speculative. No unrequested features, abstractions, or defensive error handling. If code exceeds what's needed, cut it.
3. **Surgical changes.** Make only the essential edits. Preserve the surrounding style; don't refactor unrelated code. Remove only the dependencies your change introduces, not pre-existing dead code.
4. **Goal-driven execution.** Turn vague requests into testable success criteria, then loop until verified rather than asking for constant confirmation.
