# Spec Delta: Rebalance Flow

## ADDED Requirements

### Requirement: Add New Rebalance Entry Point

The Dashboard SHALL provide an `Add New Rebalance` entry point for creating a new asset snapshot from the latest existing snapshot.

#### Scenario: User sees Dashboard with existing assets

- **WHEN** the user opens Dashboard and at least one asset snapshot exists
- **THEN** the Dashboard shows an `Add New Rebalance` action

#### Scenario: User sees Dashboard without existing assets

- **WHEN** the user opens Dashboard and no asset snapshot exists
- **THEN** the app does not offer a broken rebalance action
- **AND** the user is guided to create assets first

### Requirement: Rebalance Draft Creation

The application SHALL create a rebalance draft by copying the latest-date asset snapshot.

#### Scenario: User starts new rebalance

- **WHEN** the user clicks `Add New Rebalance`
- **THEN** the app loads all assets from the latest asset date
- **AND** creates a draft list with the same asset types and currencies
- **AND** sets the draft date to today's date by default
- **AND** does not modify the previous snapshot

#### Scenario: Latest snapshot has multiple asset types and currencies

- **WHEN** the latest snapshot includes multiple asset types or currencies
- **THEN** the rebalance draft preserves each copied row's asset type and currency

### Requirement: Rebalance Editing

The rebalance flow SHALL let the user update current amounts before saving.

#### Scenario: User edits rebalance draft

- **WHEN** the rebalance draft is displayed
- **THEN** the user can edit the rebalance date
- **AND** the user can edit each copied asset amount
- **AND** the user does not edit Asset Name
- **AND** the user can see each row's asset type and currency

#### Scenario: User enters invalid amount

- **WHEN** a copied asset row has an invalid amount
- **THEN** the app prevents saving
- **AND** shows visible feedback explaining the problem

### Requirement: Rebalance Save

The application SHALL save a rebalance as a new asset snapshot.

#### Scenario: User saves valid rebalance

- **WHEN** the user saves a valid rebalance draft
- **THEN** the app inserts a new set of assets using the selected rebalance date
- **AND** the previous snapshot remains unchanged
- **AND** Dashboard uses the new snapshot when it is the latest date
- **AND** Chart includes the new snapshot date
- **AND** the app shows visible success feedback

#### Scenario: User attempts accidental double save

- **WHEN** the user clicks save more than once during an in-progress rebalance save
- **THEN** the app prevents duplicate submissions where practical
- **AND** the final saved data should not contain duplicate rows caused solely by double-clicking save

### Requirement: Rebalance i18n

The rebalance UI SHALL support the app's supported languages.

#### Scenario: User switches language

- **WHEN** the selected language is `en-US`, `zh-CN`, or `ja-JP`
- **THEN** rebalance labels, buttons, validation messages, and success/error messages use the selected language where translations exist
- **AND** missing translations follow the existing fallback policy

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
