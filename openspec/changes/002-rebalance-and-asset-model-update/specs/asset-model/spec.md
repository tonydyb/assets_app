# Spec Delta: Asset Model Update

## ADDED Requirements

### Requirement: Asset Type Region

The application SHALL support a user-visible `Region` field on Asset Types.

#### Scenario: User views asset types

- **WHEN** the user opens Asset Types
- **THEN** each asset type row shows its Region value when available
- **AND** asset types without a Region remain valid and visible

#### Scenario: User creates asset type with region

- **WHEN** the user creates an asset type
- **THEN** the user can enter a Region value
- **AND** the Region value is persisted with the asset type
- **AND** the Region value may be empty

#### Scenario: User edits asset type region

- **WHEN** the user edits an existing asset type
- **THEN** the existing Region value is loaded into the edit form
- **AND** the user can update or clear the Region value
- **AND** the saved Region value is shown after refresh

#### Scenario: User enters multilingual region text

- **WHEN** the user enters Chinese or Japanese text in Region
- **THEN** the app accepts and saves the text without corrupting it

### Requirement: Asset Type Region Migration

The application SHALL introduce Asset Type Region without breaking existing local databases.

#### Scenario: Existing database has no region column

- **WHEN** the app starts with an existing database that has no Asset Type Region field
- **THEN** the app migrates the database safely
- **AND** existing asset types remain available
- **AND** existing assets remain available
- **AND** no existing user data is deleted

#### Scenario: Imported database uses legacy schema

- **WHEN** the user imports a database created before Asset Type Region existed
- **THEN** the imported database remains usable after validation and migration
- **AND** asset types without Region remain valid

## MODIFIED Requirements

### Requirement: Asset Name User Interface

The application SHALL remove Asset `Name` from user-facing asset workflows while preserving database compatibility.

#### Scenario: User views Dashboard current assets

- **WHEN** the user opens Dashboard
- **THEN** current assets are shown without an Asset Name column or field

#### Scenario: User views Assets list

- **WHEN** the user opens Assets
- **THEN** assets are shown without an Asset Name column or field

#### Scenario: User creates asset

- **WHEN** the user creates a new asset
- **THEN** the form does not ask for Asset Name
- **AND** the user can save the asset using date, asset type, amount, and currency

#### Scenario: User edits asset

- **WHEN** the user edits an existing asset
- **THEN** the edit form does not ask for Asset Name
- **AND** the user can update date, asset type, amount, and currency

#### Scenario: Existing asset has legacy name

- **WHEN** an existing asset row has a legacy `name` value in the database
- **THEN** the app remains compatible with that row
- **AND** the user-facing asset UI does not display or require that value

## REMOVED Requirements

None.
