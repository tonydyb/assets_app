# Spec Delta: UI Style System Refactor

## ADDED Requirements

### Requirement: Single Active Style System

The renderer SHALL use one active style system for the current Figma/Stitch visual direction.

#### Scenario: Developer inspects active renderer styles

- **WHEN** the renderer style files are inspected
- **THEN** active UI styles use the current app design tokens
- **AND** legacy MVP token usage such as `--color-*` is not required for current app pages
- **AND** the current token layer is easy to identify

#### Scenario: Legacy styles are retired

- **WHEN** legacy MVP CSS rules are no longer needed
- **THEN** they are removed from active style loading or isolated so they cannot override current app styles
- **AND** current pages do not depend on legacy global overrides for layout or form controls

### Requirement: Predictable Form and Button Styling

The renderer SHALL provide predictable shared styling for buttons and form controls.

#### Scenario: Button and input are placed in the same form row

- **WHEN** a button appears next to an input or select in a form row
- **THEN** their heights and vertical alignment are visually consistent
- **AND** no page-specific one-off patch is required to correct basic alignment

#### Scenario: Form controls are reused across pages

- **WHEN** Add Asset, Asset Types, Settings, Assets edit forms, or Rebalance forms use inputs, selects, textareas, or buttons
- **THEN** they share the same base sizing and typography rules
- **AND** page-specific styles only control layout, not basic control box-model behavior

### Requirement: Organized CSS Layers

The renderer CSS SHALL be organized so responsibilities are clear.

#### Scenario: Developer updates design tokens

- **WHEN** a developer needs to update colors, spacing, radii, shadows, or typography tokens
- **THEN** those values can be found in a dedicated token layer or file
- **AND** page-specific CSS does not redefine global tokens unnecessarily

#### Scenario: Developer updates page-specific layout

- **WHEN** a developer modifies a specific page layout
- **THEN** the page-specific rules are separated from global reset/base/component rules
- **AND** the change does not require editing unrelated page styles

### Requirement: Responsive Style Preservation

The style refactor SHALL preserve responsive behavior.

#### Scenario: App window is narrowed

- **WHEN** the app is used at a narrower desktop width
- **THEN** navigation, forms, tables, chart, and footer remain usable
- **AND** controls wrap or stack intentionally instead of overlapping

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
