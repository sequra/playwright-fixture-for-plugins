---
name: page-object
description: Scaffold a new Page Object or Fixture for playwright-fixture-for-plugins following the repo's abstract-base-class conventions — pick the right base, wire initLocators/initSelectors, stub platform-specific methods as abstract, add JSDoc types, and re-export from src/index.js. Use when adding a new page object, settings screen, or fixture to the library.
---

# Scaffold a page object / fixture

This library ships **abstract base classes**: concrete orchestration lives in the
shared class, and platform-specific bits are left as abstract methods that
downstream repos implement. New classes follow a fixed shape. **`src/pages/ProductPage.js`
is the canonical reference** — read it when a template detail is unclear.

## Before you start

1. Get the class name in `PascalCase` (e.g. `WishlistPage`).
2. **Pick the base class** by what the object is:
   - Storefront/admin screen with seQura promotional widgets → extend **`PageWithWidgets`**.
   - Other navigable page (constructor needs Playwright's `request`) → extend **`Page`**.
   - Admin back-office surface → extend **`BackOffice`**.
   - A non-page helper/data holder → extend **`Fixture`** directly.
3. Decide which methods are **concrete** (shared logic usable across platforms) vs
   **abstract** (selectors/URLs/locators that only the consuming platform knows).

## Hard constraints (non-negotiable)

- **ES modules only**, exactly one `export default class` per file.
- **JSDoc** on the constructor and every public method (`@param`, `@returns`);
  Playwright types via `import('@playwright/test')` (e.g. `import('@playwright/test').Locator`).
- Platform-specific methods **must** `throw new Error('Not implemented')` — keep that
  contract so downstream repos get a clear signal of what to implement.
- `initLocators()` / `initSelectors()` overrides spread the parent first:
  `return { ...super.initLocators(), ... }`. Locators are factory functions
  (`name: opt => this.someLocator(opt)`).
- The new class **must** be re-exported from `src/index.js`, or downstream repos
  cannot import it.

## Skeleton

`src/pages/<Name>.js` (adjust the base/import to the choice above):

```javascript
import Page from "./Page.js";

/**
 * <Name> page
 */
export default class <Name> extends Page {

    /**
     * Init the locators available
     *
     * @returns {Object}
     */
    initLocators() {
        return {
            ...super.initLocators(),
            // exampleField: opt => this.exampleLocator(opt),
        };
    }

    /**
     * Navigate to the page
     *
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        throw new Error('Not implemented');
    }
}
```

Then add to `src/index.js`, keeping the existing one-per-line style:

```javascript
export { default as <Name> } from './pages/<Name>.js';
```

## Verify

No in-repo test runner exists; verify the scaffold parses and exports cleanly:

- `node --check src/pages/<Name>.js`
- `node --check src/index.js`
- The pre-commit hook (`./setup.sh` enables it) runs `node --check` on staged JS.

## Checklist

- [ ] Extends the correct base class for what the object is
- [ ] One `export default class`, ES module syntax
- [ ] JSDoc types on constructor + public methods
- [ ] Platform-specific methods `throw new Error('Not implemented')`
- [ ] `initLocators`/`initSelectors` spread `super` first (if overridden)
- [ ] Re-exported from `src/index.js`
- [ ] `node --check` passes on the new file and `src/index.js`
