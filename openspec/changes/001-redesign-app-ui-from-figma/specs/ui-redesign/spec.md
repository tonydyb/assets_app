# Spec Delta: UI Redesign From Figma

## ADDED Requirements

### Requirement: Figma-Based Visual Redesign

The application SHALL update its user interface to follow the approved Figma design direction while preserving all existing supported features.

#### Scenario: User opens the redesigned app

- **WHEN** the user opens the app
- **THEN** the app displays a polished financial-dashboard style interface based on the Figma design
- **AND** the interface uses consistent typography, colors, spacing, cards, navigation, tables, forms, and status indicators
- **AND** existing user data remains visible and unchanged

#### Scenario: Figma sample data differs from real data

- **WHEN** the Figma design contains static sample values
- **THEN** the implemented app SHALL use real persisted application data instead of hard-coded Figma sample data

### Requirement: Shared App Shell

The application SHALL provide a consistent app shell across all pages.

#### Scenario: User navigates between pages

- **WHEN** the user opens Dashboard, Assets, Add Asset, Chart, Asset Types, or Settings
- **THEN** the page uses the same high-level layout and navigation pattern
- **AND** the current page is visually identifiable
- **AND** navigation order is Overview, Charts, Assets, Add Asset, Asset Types, Settings
- **AND** navigation labels follow the selected application language

### Requirement: Dashboard Redesign

The Dashboard page SHALL display total assets, current assets, and FX status using the Figma visual direction.

#### Scenario: User views Dashboard

- **WHEN** the user opens Dashboard
- **THEN** the total asset amount is visually prominent
- **AND** the display currency is shown next to the amount
- **AND** the current/latest assets are shown in a readable table or card-based section
- **AND** FX status and last updated time remain visible in the shared footer or status area
- **AND** Dashboard content does not duplicate the shared FX status line
- **AND** last updated values are displayed as date-only text in `YYYY-MM-DD` format

#### Scenario: Dashboard total is calculated

- **WHEN** Dashboard calculates total asset value
- **THEN** it uses the latest asset date set
- **AND** it converts each asset to the selected display currency before summing
- **AND** it does not silently include assets with missing exchange rates

### Requirement: Chart Redesign

The Chart page SHALL display historical total assets as a visible vertical bar chart.

#### Scenario: User opens Chart page

- **WHEN** the user opens Chart
- **THEN** the chart displays one vertical bar per asset date
- **AND** each bar represents total assets for that date converted to the selected display currency
- **AND** each bar has a visible date label
- **AND** each bar has a visible amount label
- **AND** the chart identifies the selected display currency

#### Scenario: Chart data changes

- **WHEN** the user adds, edits, or deletes assets
- **OR** changes display currency
- **OR** changes exchange rates
- **THEN** the chart updates to reflect the current persisted data and settings

### Requirement: Assets Page Redesign

The Assets page SHALL preserve asset management behavior while applying the Figma table and action styling.

#### Scenario: User views assets

- **WHEN** the user opens Assets
- **THEN** assets are shown with date, type, name, amount, and currency
- **AND** amount values are formatted with thousands separators
- **AND** pagination remains available when the number of rows exceeds the page size

#### Scenario: User edits an asset

- **WHEN** the user edits an asset
- **THEN** the user can modify date, type, name, amount, and currency
- **AND** the name may be empty
- **AND** the amount accepts integer input
- **AND** Chinese and Japanese text input remains usable

### Requirement: Add Asset Page Redesign

The Add Asset page SHALL preserve asset creation behavior while applying the Figma form styling.

#### Scenario: User creates an asset

- **WHEN** the user creates a new asset
- **THEN** the user can choose date, type, currency, and amount
- **AND** the user may leave name empty
- **AND** the amount accepts integer input
- **AND** form controls use compact grouped widths on desktop instead of each control spanning the full page width
- **AND** the created asset appears in relevant asset lists and calculations

### Requirement: Asset Types Page Redesign

The Asset Types page SHALL preserve asset type management behavior while applying the Figma visual style.

#### Scenario: User manages asset types

- **WHEN** the user opens Asset Types
- **THEN** the user can add, edit, and delete asset types
- **AND** Chinese and Japanese type names can be entered and saved
- **AND** Add Type inputs and action button do not overlap and wrap responsively
- **AND** all labels and messages follow the selected application language

### Requirement: Settings Page Redesign

The Settings page SHALL preserve language, currency, FX, and local database migration controls while applying the Figma visual style.

#### Scenario: User changes language

- **WHEN** the user changes language in Settings
- **THEN** the app persists the selected language
- **AND** supported UI labels update according to the selected language

#### Scenario: User changes display currency

- **WHEN** the user changes display currency in Settings
- **THEN** the app persists the selected display currency
- **AND** Dashboard and Chart use the selected display currency

#### Scenario: User edits exchange rates

- **WHEN** the user edits and saves exchange rates in Settings
- **THEN** the app persists the exchange rates
- **AND** Dashboard and Chart calculations reflect the saved rates
- **AND** updated-at information remains visible
- **AND** updated-at information is displayed as date-only text in `YYYY-MM-DD` format

#### Scenario: User exports local database

- **WHEN** the user clicks Export Data in Settings
- **THEN** the app allows exporting the current local database as a `.db` file
- **AND** the redesigned UI shows success or error feedback

#### Scenario: User imports local database

- **WHEN** the user clicks Import Data in Settings
- **THEN** the app asks the user to confirm that current data will be overwritten
- **AND** after confirmation, the app allows selecting a `.db` file
- **AND** the app validates the selected database before replacing current data
- **AND** the app creates an automatic backup before replacing current data
- **AND** the app restarts after a successful import
- **AND** the redesigned UI shows failure feedback if import does not complete

### Requirement: Multilingual UI Preservation

The redesign SHALL preserve multilingual behavior for all redesigned pages.

#### Scenario: User switches language

- **WHEN** the user switches between `en-US`, `zh-CN`, and `ja-JP`
- **THEN** Dashboard, Assets, Add Asset, Chart, Asset Types, and Settings display translated labels where translations exist
- **AND** missing translations follow the existing fallback policy

### Requirement: Responsive Behavior

The redesigned UI SHALL remain usable at desktop and narrow widths.

#### Scenario: User resizes the app window

- **WHEN** the app window width changes
- **THEN** primary content remains readable
- **AND** navigation remains usable
- **AND** tables, forms, and charts do not overflow in a way that blocks user actions

## MODIFIED Requirements

### Requirement: UI Design Source

The UI design source SHALL be the approved Figma design rather than the previous plain MVP-style layout.

#### Scenario: Developer implements UI changes

- **WHEN** UI code is changed for this redesign
- **THEN** the implementation SHOULD use the Figma design as the visual reference
- **AND** deviations SHOULD be intentional and documented when required by framework or data constraints

## REMOVED Requirements

None.
