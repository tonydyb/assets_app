# Tasks: Rebalance and Asset Model Update

## 1. Specification and Documentation

- [x] Create OpenSpec change proposal.
- [x] Define requirements for Asset Name removal/deprecation.
- [x] Define requirements for Asset Type Region.
- [x] Define requirements for Add New Rebalance flow.
- [x] Define requirements for Settings save feedback.
- [x] Update `01.SRS.md` with user-visible requirements and acceptance criteria.
- [x] Update `02.HLD.md` with rebalance flow and asset type region data flow.
- [x] Update `03.DDL.md` with `asset_type.region` migration direction and `asset.name` compatibility note.
- [x] Update `04.LLD.md` with service/UI flow details.
- [x] Update `05.UI 设计文档.md` with updated interactive prototype behavior.

## 2. Database and Migration

- [x] Add safe migration for `asset_type.region`.
- [x] Preserve compatibility with existing `asset.name` column.
- [x] Ensure existing databases open without data loss.
- [x] Ensure imported databases with legacy `asset.name` remain valid.
- [x] Add or update backup behavior if migration changes database structure.

## 3. Asset Name UI Removal

- [x] Remove Asset Name column from Dashboard current assets table.
- [x] Remove Asset Name column from Assets list table.
- [x] Remove Asset Name input from Add Asset form.
- [x] Remove Asset Name input from Edit Asset form.
- [x] Stop writing user-entered name values for new assets.
- [x] Preserve existing business calculations after removing Name from UI.
- [x] Update multilingual labels and fallback behavior.

## 4. Asset Type Region

- [x] Add Region field to Asset Type create flow.
- [x] Add Region field to Asset Type edit flow.
- [x] Show Region in Asset Types list.
- [x] Persist Region in database.
- [x] Load Region when editing existing asset types.
- [x] Support empty Region without blocking save.
- [x] Support Chinese/Japanese Region text input.
- [x] Add multilingual labels and validation messages.

## 5. Add New Rebalance Flow

- [x] Add `Add New Rebalance` button to Dashboard.
- [x] Define empty state when no previous asset snapshot exists.
- [x] Load latest-date asset snapshot as rebalance template.
- [x] Set rebalance date to today by default.
- [x] Allow user to change rebalance date before saving.
- [x] Show copied assets without Asset Name.
- [x] Allow bulk editing of each copied asset amount.
- [x] Preserve copied asset type and currency.
- [x] Validate amount input before save.
- [x] Save rebalance as a new asset snapshot.
- [x] Prevent accidental double-save where practical.
- [x] After save, navigate to Dashboard or Assets with visible success feedback.
- [x] Ensure Dashboard total uses the saved rebalance snapshot.
- [x] Ensure Chart includes the saved rebalance date.

## 6. Settings Save Feedback

- [x] Show success feedback after `Save Preferences` completes.
- [x] Show error feedback if `Save Preferences` fails.
- [x] Show success feedback after `Save FX Rates` completes.
- [x] Show error feedback if `Save FX Rates` fails.
- [x] Keep feedback visible long enough to be noticed.
- [x] Ensure feedback text is multilingual.

## 7. Verification

- [x] Run the app locally.
- [x] Verify existing database opens after migration.
- [x] Verify Dashboard no longer shows Asset Name.
- [x] Verify Assets list no longer shows Asset Name.
- [x] Verify Add Asset works without Name.
- [x] Verify Edit Asset works without Name.
- [x] Verify Asset Type Region can be added, edited, listed, and persisted.
- [x] Verify Rebalance copies latest-date assets and defaults date to today.
- [x] Verify Rebalance save creates a new snapshot without modifying previous snapshots.
- [x] Verify Dashboard total changes after Rebalance save.
- [x] Verify Chart changes after Rebalance save.
- [x] Verify Settings Preferences feedback appears after save.
- [x] Verify Settings FX feedback appears after save.
- [x] Verify `en-US`, `zh-CN`, and `ja-JP` labels for new UI.
- [x] Verify local database export/import remains compatible.
- [x] Verify no existing persisted data is deleted during normal startup or migration.
