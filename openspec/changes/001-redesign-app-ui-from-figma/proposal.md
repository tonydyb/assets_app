# Change: Redesign App UI From Figma

## ID

`001-redesign-app-ui-from-figma`

## Status

Proposed

## Figma Source

- Design: https://www.figma.com/design/CNfvzjkUAth8azTLKpIedW/Asset-Manager?node-id=0-1&p=f&t=dMv1412dlGC2Erux-0

## Summary

Redesign the Asset Manager application UI to match the Figma design while preserving the existing asset management, multi-language, multi-currency, exchange-rate, chart, local database import/export, and persistence behavior.

## Motivation

The current UI is functional but visually plain and difficult to present as a polished app. The new Figma design establishes a more modern financial dashboard experience with clearer hierarchy, navigation, cards, table styling, chart presentation, and settings layout.

## Scope

In scope:

- Apply the Figma visual direction to the existing app pages.
- Introduce a consistent app shell, navigation, layout grid, cards, typography, spacing, colors, buttons, tables, forms, and status indicators.
- Redesign these pages:
  - Dashboard
  - Assets
  - Add Asset
  - Chart
  - Asset Types
  - Settings
- Keep all existing user-visible behavior working:
  - asset create/read/update/delete
  - asset type create/read/update/delete
  - language switching
  - display currency switching
  - manual exchange-rate editing
  - FX status display
  - chart by date using display currency
  - local database export
  - local database import with confirmation, backup, and restart
- Preserve supported languages: `en-US`, `zh-CN`, `ja-JP`.
- Preserve supported currencies: `JPY`, `CNY`, `USD`.
- Preserve existing persisted data and database compatibility.

Out of scope:

- Changing the core database schema unless required by an already accepted migration.
- Adding cloud backup, AWS S3 sync, account login, subscription, or payment features.
- Adding new asset analytics beyond the Figma redesign unless separately specified.
- Replacing the selected application framework.

## Non-Goals

- This change is not a business-logic rewrite.
- This change is not a data migration project.
- This change is not a new pricing or paid-feature implementation.

## Risks

- The Figma design may contain static sample data that differs from real application data.
- Some design elements may not map directly to the current UI technology and may require pragmatic adaptation.
- Visual changes could accidentally break existing i18n, currency conversion, chart, or import/export behavior if not verified page by page.

## Rollout Plan

1. Extract Figma design tokens and page structure.
2. Implement global layout and shared UI styles/components.
3. Redesign Dashboard.
4. Redesign Chart.
5. Redesign Assets and Add Asset.
6. Redesign Asset Types.
7. Redesign Settings, including exchange rates and local import/export.
8. Run regression checks for UI, i18n, currency conversion, chart refresh, CRUD, and import/export.

## Acceptance Summary

The redesigned app should visually match the Figma direction and all existing features should remain usable. No user data should be lost, and local `.db` import/export must remain visible and functional from Settings.
