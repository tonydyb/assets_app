# Tasks: UI Codebase Refactor

## 1. Specification

- [x] Create OpenSpec change proposal.
- [x] Define CSS style-system refactor requirements.
- [x] Define renderer modularization requirements.
- [x] Define refactor safety and behavior-preservation requirements.
- [x] Add Chinese reading version.

## 2. CSS Inventory and Plan

- [x] Inventory active selectors in `renderer/mvp.css`.
- [x] Identify legacy MVP rules using `--color-*` tokens.
- [x] Identify current redesign rules using `--am-*` tokens.
- [x] Identify duplicated global element selectors for buttons, inputs, forms, tables, and labels.
- [x] Decide whether to keep one CSS bundle or split into imported CSS files.

## 3. Style System Refactor

- [x] Create a single active token layer for the current UI direction.
- [x] Remove active usage of legacy `--color-*` tokens.
- [x] Normalize `box-sizing`, typography inheritance, and root/body styles.
- [x] Normalize button, input, select, textarea, label, and form control sizing.
- [x] Replace broad global overrides with reusable component classes where practical.
- [x] Organize styles into tokens, reset/base, layout, components, and page-specific layers.
- [x] Ensure Add Type input/button alignment works without local one-off hacks.
- [x] Ensure Add Asset form layout remains compact and responsive.
- [x] Ensure tables, pagination, chart, footer, and navigation keep the redesigned visual direction.

## 4. Renderer Code Inventory and Plan

- [x] Map current `renderer/app-react.js` functions and page components.
- [x] Identify pure utilities to extract first.
- [x] Identify shared layout/components to extract second.
- [x] Identify page components and their API dependencies.
- [x] Decide whether to use a bundler such as Vite/esbuild or script-loaded modules.

## 5. Renderer Modularization

- [x] Extract formatting and currency conversion utilities.
- [x] Extract i18n dictionaries and translation helper.
- [x] Extract shared app shell, navigation, and status footer.
- [x] Extract reusable UI components such as cards, tables, form fields, buttons, segmented controls, and feedback banners where useful through shared style components.
- [x] Extract `DashboardPage`.
- [x] Extract `AssetsPage`.
- [x] Extract `AddAssetPage`.
- [x] Extract `AssetTypesPage`.
- [x] Extract `SettingsPage`.
- [x] Extract `ChartPage`.
- [x] Extract `RebalancePage`.
- [x] Keep the renderer entry point thin and easy to read.

## 6. Build and Runtime Wiring

- [x] Update renderer HTML/script loading if files are split without a bundler.
- [x] Skip bundler configuration because script-loaded modules were selected.
- [x] Ensure development startup still works with `npm start`.
- [x] Keep Electron packaging compatible because no generated renderer assets were introduced.
- [x] Keep development commands unchanged because no build step was introduced.

## 7. Regression Verification

- [x] Run OpenSpec validation.
- [x] Run the Electron app locally.
- [ ] Verify Dashboard layout, totals, FX status, and rebalance entry point.
- [ ] Verify Assets list, pagination, edit, delete, and duplicate behavior where supported.
- [ ] Verify Add Asset creates data.
- [ ] Verify Asset Types add/edit/delete and Region behavior.
- [ ] Verify Chart renders current converted totals.
- [ ] Verify Settings language, display currency, FX rates, import, and export behavior.
- [ ] Verify Rebalance creates a new snapshot.
- [ ] Verify `en-US`, `zh-CN`, and `ja-JP` language switching after modularization.
- [ ] Verify no existing database data is deleted or rewritten unexpectedly.
- [x] Verify no duplicate legacy CSS rules are still active for form controls and buttons.
