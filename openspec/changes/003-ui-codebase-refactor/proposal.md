# Change: UI Codebase Refactor

## ID

`003-ui-codebase-refactor`

## Status

Proposed

## Summary

Refactor the renderer UI codebase so the redesigned app is easier to maintain and less vulnerable to style regressions:

- Replace the mixed legacy MVP CSS and newer Figma/Stitch CSS with a single modern style system.
- Split the large `renderer/app-react.js` file into focused modules for shared utilities, i18n, layout components, reusable UI components, and page components.
- Preserve all user-visible behavior, local database compatibility, Electron runtime behavior, and existing OpenSpec feature requirements.

## Motivation

The current renderer implementation is carrying two eras of code at once:

- `renderer/mvp.css` still contains legacy global styles based on `--color-*` tokens.
- Newer redesigned UI styles use `--am-*` tokens and override legacy selectors.
- Global selectors for `button`, `input`, `select`, `form`, and `label` are defined more than once, causing repeated alignment and layout issues.
- `renderer/app-react.js` contains all pages, i18n, formatting, currency conversion, app shell, and API calls in one large file, making future changes risky.

This refactor is intended to reduce accidental coupling, make visual behavior predictable, and prepare the codebase for continued UI and feature work.

## Scope

In scope:

- Create a single active renderer style system using the current Figma/Stitch visual direction.
- Retire legacy MVP CSS rules and old `--color-*` token usage from active styles.
- Organize CSS into smaller files or clearly separated sections for tokens, reset/base, layout, components, and page-specific styles.
- Standardize base form control and button sizing so inputs, selects, and buttons align predictably.
- Avoid broad global component styling where page/component classes are safer.
- Split `renderer/app-react.js` into maintainable modules.
- Extract i18n, formatting, currency conversion, shared shell, shared components, and individual page components.
- Keep a simple renderer entry point that only bootstraps the app.
- Add or update minimal build/loading infrastructure if module splitting requires it.
- Preserve current behavior for Dashboard, Assets, Add Asset, Asset Types, Chart, Settings, and Rebalance.
- Preserve local SQLite database import/export behavior.
- Preserve supported languages: `en-US`, `zh-CN`, `ja-JP`.
- Preserve supported currencies: `JPY`, `CNY`, `USD`.

Out of scope:

- Redesigning the product beyond the already approved Figma/Stitch visual direction.
- Changing database schema or migrations.
- Changing asset, asset type, FX, chart, import/export, or rebalance business rules.
- Adding cloud backup, AWS S3 sync, account login, subscriptions, or payment features.
- Replacing Electron as the desktop framework.

## Compatibility Strategy

This change should be implemented as an internal refactor. The app should continue to run against existing local databases and existing renderer pages. If a bundler is introduced, the packaged Electron app must still load local renderer files correctly.

Existing public IPC/preload APIs should remain compatible unless a separately approved change updates them.

## Risks

- Removing legacy CSS can reveal hidden dependencies where pages relied on old global rules.
- Splitting a large renderer file can introduce load-order or scope errors if modules are not wired carefully.
- Adding a bundler changes local development and packaging paths if not configured conservatively.
- Visual regression is possible if component classes are missed during migration.

## Rollout Plan

1. Add this OpenSpec change and confirm refactor boundaries.
2. Inventory active CSS selectors, tokens, and page dependencies.
3. Create the new style structure and migrate current visual rules into it.
4. Remove active reliance on legacy MVP CSS and duplicate global form/button styles.
5. Verify all pages visually and interactively after CSS migration.
6. Extract pure utilities and i18n from `app-react.js`.
7. Extract shared layout and reusable components.
8. Extract page components one page at a time.
9. Keep or introduce a thin renderer entry point and update script loading/build as needed.
10. Run full app verification and package/loading smoke checks.

## Acceptance Summary

After this change, renderer styles should have one source of truth, form controls and buttons should align consistently without per-bug patches, and renderer React code should be modular enough that each page can be changed without editing a monolithic file. User-visible functionality and persisted data must remain unchanged.
