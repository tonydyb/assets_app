# Spec Delta: Refactor Safety

## ADDED Requirements

### Requirement: Behavior Preservation During UI Refactor

The UI codebase refactor SHALL preserve existing user-visible behavior.

#### Scenario: User opens each app page after refactor

- **WHEN** the user opens Dashboard, Assets, Add Asset, Chart, Asset Types, Settings, or Rebalance
- **THEN** the page remains available
- **AND** the page's existing supported behavior still works

#### Scenario: User works with persisted data after refactor

- **WHEN** the app starts with an existing local database
- **THEN** existing assets, asset types, exchange rates, settings, and snapshots remain available
- **AND** no data is deleted or rewritten solely because renderer files were refactored

### Requirement: Feature Regression Prevention

The refactor SHALL preserve accepted feature requirements from previous changes.

#### Scenario: Existing feature requirements are verified

- **WHEN** the refactor is implemented
- **THEN** Dashboard total calculation still uses latest-date assets and FX conversion
- **AND** Chart still shows converted totals by date
- **AND** Assets CRUD remains usable
- **AND** Add Asset remains usable
- **AND** Asset Types CRUD and Region remain usable
- **AND** Settings preferences, FX rates, import, and export remain usable
- **AND** Rebalance remains usable

### Requirement: Multilingual Preservation During Refactor

The refactor SHALL preserve supported language behavior.

#### Scenario: User switches language after refactor

- **WHEN** the user switches between `en-US`, `zh-CN`, and `ja-JP`
- **THEN** translated labels and feedback continue to render where translations exist
- **AND** missing translations follow the existing fallback behavior

### Requirement: Refactor Verification

The refactor SHALL include validation and local smoke verification.

#### Scenario: Developer completes a refactor stage

- **WHEN** a refactor stage is complete
- **THEN** OpenSpec validation is run for affected changes
- **AND** the Electron app is started locally
- **AND** any failures are fixed before continuing to a broader refactor stage

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
