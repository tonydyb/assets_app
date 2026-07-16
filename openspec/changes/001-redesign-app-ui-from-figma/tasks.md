# Tasks: Redesign App UI From Figma

## 1. Design Intake

- [x] Connect to or inspect the Figma design source.
- [x] Identify target frames for Dashboard, Assets, Add Asset, Chart, Asset Types, and Settings.
- [x] Extract design tokens: colors, typography, spacing, radius, shadow, borders, and icon usage.
- [x] Identify reusable components: app shell, top navigation, cards, tables, forms, buttons, segmented controls, status badges, chart card, footer/status bar.

## 2. Implementation Planning

- [x] Confirm target codebase for this change.
- [x] Map Figma screens to existing app pages.
- [x] Decide which existing business logic remains untouched.
- [x] Identify shared CSS/components to introduce or refactor.
- [x] Define responsive behavior for desktop and narrow/mobile widths.

## 3. Global UI Foundation

- [x] Implement global theme tokens.
- [x] Implement shared app shell layout.
- [x] Implement unified navigation style.
- [x] Implement shared card, table, form, button, badge, and status styles.
- [ ] Ensure all shared UI works with `en-US`, `zh-CN`, and `ja-JP` text lengths.

## 4. Dashboard

- [x] Redesign total asset summary according to Figma.
- [x] Show display currency beside total asset amount.
- [x] Show current/latest assets in the redesigned table/card layout.
- [x] Preserve latest-date total asset calculation.
- [x] Preserve FX status and updated-at display.
- [x] Verify missing/stale FX states remain visible.

## 5. Chart

- [x] Redesign Chart page according to Figma.
- [x] Render a visible vertical bar chart for total assets by date.
- [x] Show date labels on the X axis.
- [x] Show amount labels above bars.
- [x] Show the selected display currency in title, axis, or summary.
- [ ] Preserve chart recalculation when assets, display currency, or exchange rates change.

## 6. Assets and Add Asset

- [x] Redesign Assets page table, pagination, and action buttons.
- [x] Preserve edit, delete, duplicate if currently supported, and pagination behavior.
- [x] Redesign Add Asset form.
- [x] Preserve date selection, type selection, optional name input, integer amount input, and currency selection.
- [ ] Verify Chinese/Japanese text input still works.

## 7. Asset Types

- [x] Redesign Asset Types page.
- [x] Preserve add, edit, delete behavior.
- [x] Preserve multilingual labels and validation messages.
- [ ] Verify Chinese/Japanese type names can be entered and saved.

## 8. Settings

- [x] Redesign Settings page according to Figma.
- [x] Preserve language selector.
- [x] Preserve display currency selector.
- [x] Preserve FX cache TTL input.
- [x] Preserve manual exchange-rate editor.
- [x] Preserve local Export Data button and behavior.
- [x] Preserve local Import Data button and behavior.
- [x] Preserve import confirmation before overwrite.
- [x] Preserve automatic backup before import.
- [x] Preserve app restart after successful import.
- [x] Show import/export success and error feedback in the redesigned UI.

## 9. Verification

- [x] Run the app locally.
- [x] Verify Dashboard with existing data.
- [ ] Verify Assets CRUD.
- [ ] Verify Add Asset creates data and Dashboard/Chart update.
- [ ] Verify Asset Types CRUD.
- [ ] Verify Settings language switching.
- [ ] Verify Settings display currency switching.
- [ ] Verify exchange-rate edits affect Dashboard and Chart.
- [ ] Verify local database export creates a valid `.db` file.
- [ ] Verify local database import confirms overwrite, backs up current data, imports selected `.db`, and restarts the app.
- [ ] Verify responsive behavior at desktop and narrow widths.
- [ ] Verify no existing persisted data is deleted during normal app startup.
