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

- [ ] Add safe migration for `asset_type.region`.
- [ ] Preserve compatibility with existing `asset.name` column.
- [ ] Ensure existing databases open without data loss.
- [ ] Ensure imported databases with legacy `asset.name` remain valid.
- [ ] Add or update backup behavior if migration changes database structure.

## 3. Asset Name UI Removal

- [ ] Remove Asset Name column from Dashboard current assets table.
- [ ] Remove Asset Name column from Assets list table.
- [ ] Remove Asset Name input from Add Asset form.
- [ ] Remove Asset Name input from Edit Asset form.
- [ ] Stop writing user-entered name values for new assets.
- [ ] Preserve existing business calculations after removing Name from UI.
- [ ] Update multilingual labels and fallback behavior.

## 4. Asset Type Region

- [ ] Add Region field to Asset Type create flow.
- [ ] Add Region field to Asset Type edit flow.
- [ ] Show Region in Asset Types list.
- [ ] Persist Region in database.
- [ ] Load Region when editing existing asset types.
- [ ] Support empty Region without blocking save.
- [ ] Support Chinese/Japanese Region text input.
- [ ] Add multilingual labels and validation messages.

## 5. Add New Rebalance Flow

- [ ] Add `Add New Rebalance` button to Dashboard.
- [ ] Define empty state when no previous asset snapshot exists.
- [ ] Load latest-date asset snapshot as rebalance template.
- [ ] Set rebalance date to today by default.
- [ ] Allow user to change rebalance date before saving.
- [ ] Show copied assets without Asset Name.
- [ ] Allow bulk editing of each copied asset amount.
- [ ] Preserve copied asset type and currency.
- [ ] Validate amount input before save.
- [ ] Save rebalance as a new asset snapshot.
- [ ] Prevent accidental double-save where practical.
- [ ] After save, navigate to Dashboard or Assets with visible success feedback.
- [ ] Ensure Dashboard total uses the saved rebalance snapshot.
- [ ] Ensure Chart includes the saved rebalance date.

## 6. Settings Save Feedback

- [ ] Show success feedback after `Save Preferences` completes.
- [ ] Show error feedback if `Save Preferences` fails.
- [ ] Show success feedback after `Save FX Rates` completes.
- [ ] Show error feedback if `Save FX Rates` fails.
- [ ] Keep feedback visible long enough to be noticed.
- [ ] Ensure feedback text is multilingual.

## 7. Verification

- [ ] Run the app locally.
- [ ] Verify existing database opens after migration.
- [ ] Verify Dashboard no longer shows Asset Name.
- [ ] Verify Assets list no longer shows Asset Name.
- [ ] Verify Add Asset works without Name.
- [ ] Verify Edit Asset works without Name.
- [ ] Verify Asset Type Region can be added, edited, listed, and persisted.
- [ ] Verify Rebalance copies latest-date assets and defaults date to today.
- [ ] Verify Rebalance save creates a new snapshot without modifying previous snapshots.
- [ ] Verify Dashboard total changes after Rebalance save.
- [ ] Verify Chart changes after Rebalance save.
- [ ] Verify Settings Preferences feedback appears after save.
- [ ] Verify Settings FX feedback appears after save.
- [ ] Verify `en-US`, `zh-CN`, and `ja-JP` labels for new UI.
- [ ] Verify local database export/import remains compatible.
- [ ] Verify no existing persisted data is deleted during normal startup or migration.
