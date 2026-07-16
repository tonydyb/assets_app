# Spec Delta: Renderer Modularization

## ADDED Requirements

### Requirement: Modular Renderer Source Structure

The renderer React source SHALL be split into focused modules instead of one monolithic page file.

#### Scenario: Developer opens renderer entry point

- **WHEN** a developer opens the renderer entry point
- **THEN** it primarily bootstraps the app
- **AND** it does not contain all page implementations inline

#### Scenario: Developer edits one page

- **WHEN** a developer needs to update Dashboard, Assets, Add Asset, Asset Types, Chart, Settings, or Rebalance
- **THEN** that page's primary component can be found in a dedicated page module
- **AND** editing that page does not require navigating a monolithic renderer file containing every other page

### Requirement: Shared Utilities Extraction

Shared renderer logic SHALL be extracted from page components.

#### Scenario: Developer needs formatting logic

- **WHEN** a developer needs amount, date, or currency conversion helpers
- **THEN** those helpers are available from shared utility modules
- **AND** page components do not duplicate formatting or conversion implementations

#### Scenario: Developer needs translations

- **WHEN** a developer needs app translations
- **THEN** dictionaries and translation helpers are available from an i18n module
- **AND** page components consume translations through a shared mechanism

### Requirement: Shared UI Component Extraction

Common app shell and UI patterns SHALL be reusable renderer components.

#### Scenario: Developer updates navigation or footer

- **WHEN** navigation or footer UI is changed
- **THEN** the shared component is updated in one place
- **AND** all pages using the app shell receive the change consistently

#### Scenario: Developer updates common UI patterns

- **WHEN** card, table, form field, button, segmented control, or feedback banner behavior is changed
- **THEN** the relevant reusable component or style can be updated without hand-editing every page implementation

### Requirement: Runtime Loading Remains Reliable

The renderer modularization SHALL keep Electron development and packaging reliable.

#### Scenario: Developer starts app locally

- **WHEN** the developer runs `npm start`
- **THEN** the renderer loads successfully
- **AND** all pages can be opened without module loading errors

#### Scenario: App is packaged

- **WHEN** the app is packaged for distribution
- **THEN** any generated renderer assets required by modularization are included
- **AND** local file URLs used by Electron continue to resolve correctly

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
