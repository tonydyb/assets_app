# Change: Rebalance and Asset Model Update

## ID

`002-rebalance-and-asset-model-update`

## Status

Proposed

## Summary

Update the asset model and user flows to better match the Figma design and the intended portfolio-management workflow:

- Remove the user-visible Asset `Name` field from asset entry, editing, listing, Dashboard, and Chart-related displays.
- Add a `Region` field to Asset Type so asset categories can be grouped by geography or market region.
- Add an `Add New Rebalance` flow from Dashboard that copies the latest-date asset set, changes the date to today, lets the user update current amounts in bulk, and saves the new snapshot.
- Add visible success/error feedback after saving Preferences and FX Rates in Settings.

## Motivation

The app is shifting from individual asset note-taking toward repeatable portfolio snapshot tracking. The current Asset `Name` field adds noise to the redesigned UI and does not match the target Figma information hierarchy. Region belongs to Asset Type rather than Asset because region is usually category-level metadata. A rebalance workflow reduces repetitive data entry when users periodically update the same asset set.

Settings currently saves preferences and FX rates without enough visible feedback, which makes users unsure whether changes succeeded.

## Scope

In scope:

- Hide/remove Asset `Name` from user-facing UI.
- Stop requiring or encouraging users to enter Asset `Name`.
- Preserve backward compatibility with existing databases that still contain `asset.name`.
- Add Asset Type `Region` as user-visible metadata.
- Persist Asset Type `Region` in the local database.
- Display and edit Asset Type `Region` in Asset Types UI.
- Add Dashboard `Add New Rebalance` entry point.
- Add a rebalance creation flow based on the latest asset date snapshot.
- Allow bulk editing of copied asset amounts before save.
- Save the rebalance as a new asset snapshot dated today by default.
- Make Dashboard and Chart reflect the new rebalance snapshot after save.
- Add visible Settings feedback after saving Preferences and FX Rates.
- Preserve multi-language support for new labels and messages in `en-US`, `zh-CN`, and `ja-JP`.
- Update relevant docs after implementation.

Out of scope:

- Cloud sync, AWS S3 backup, account login, paid feature gating, or subscription logic.
- Full historical data cleanup or destructive removal of existing `asset.name` values.
- Advanced rebalance target allocation recommendations.
- AI diagnosis or investment advice.
- Changing supported currencies beyond `JPY`, `CNY`, and `USD`.

## Compatibility Strategy

The implementation SHOULD NOT physically drop the existing `asset.name` database column in the first version of this change. Instead:

- Existing `asset.name` values may remain in the database for backward compatibility.
- New and edited assets should not require `name`.
- User-facing screens should not show or edit `name`.
- Export/import should remain compatible with databases that still contain `asset.name`.

Asset Type `Region` should be introduced through a safe migration that preserves existing asset types.

## Data Model Direction

- `asset.name`: deprecated for UI and new writes, retained for compatibility.
- `asset_type.region`: new nullable or defaulted field.
- Region values should be simple user-visible text in the first version unless a later spec defines a controlled vocabulary.

## Risks

- Removing Asset `Name` from UI may hide useful legacy details for existing users.
- Rebalance duplication could accidentally create duplicate snapshots if users save twice.
- Region migration must not break existing databases or imported backups.
- Dashboard and Chart calculations must continue using latest-date snapshots and FX conversion correctly after rebalance save.
- Settings feedback must avoid implying success before persistence actually completes.

## Rollout Plan

1. Update specs and docs for Asset `Name` deprecation, Asset Type `Region`, Rebalance, and Settings feedback.
2. Add database migration for `asset_type.region`.
3. Update service/repository APIs for Asset Type region and rebalance creation.
4. Remove Asset Name from Dashboard, Assets, Add Asset, edit forms, and docs.
5. Add Asset Type Region to Asset Types list/add/edit UI.
6. Add `Add New Rebalance` button to Dashboard.
7. Implement rebalance draft page or modal for bulk amount editing.
8. Save rebalance as a new snapshot and refresh Dashboard/Chart state.
9. Add Settings save feedback for Preferences and FX Rates.
10. Run regression checks for CRUD, FX conversion, Chart updates, import/export compatibility, and i18n.

## Acceptance Summary

Users should no longer see or enter Asset `Name`. Asset Types should support a persisted `Region`. Dashboard should offer a one-click rebalance workflow that copies the latest asset snapshot, updates the date to today, allows bulk amount entry, and saves a new snapshot. Settings save actions should show clear feedback. Existing data and database backups should remain compatible.
