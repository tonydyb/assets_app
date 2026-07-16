# Spec Delta: Settings Save Feedback

## ADDED Requirements

### Requirement: Preferences Save Feedback

The Settings page SHALL show visible feedback after saving Preferences.

#### Scenario: Preferences save succeeds

- **WHEN** the user clicks `Save Preferences`
- **AND** the preferences are persisted successfully
- **THEN** the app shows a visible success message
- **AND** the message clearly indicates that preferences were saved

#### Scenario: Preferences save fails

- **WHEN** the user clicks `Save Preferences`
- **AND** the preferences are not persisted successfully
- **THEN** the app shows a visible error message
- **AND** the message does not imply success

### Requirement: FX Rates Save Feedback

The Settings page SHALL show visible feedback after saving FX Rates.

#### Scenario: FX rates save succeeds

- **WHEN** the user clicks `Save FX Rates`
- **AND** the valid FX rates are persisted successfully
- **THEN** the app shows a visible success message
- **AND** the message clearly indicates that FX rates were saved

#### Scenario: FX rates save fails

- **WHEN** the user clicks `Save FX Rates`
- **AND** the FX rates are not persisted successfully
- **THEN** the app shows a visible error message
- **AND** the message does not imply success

### Requirement: Settings Feedback i18n

Settings save feedback SHALL support the app's supported languages.

#### Scenario: User changes language

- **WHEN** Settings feedback is shown in `en-US`, `zh-CN`, or `ja-JP`
- **THEN** the feedback uses the selected language where translations exist
- **AND** missing translations follow the existing fallback policy

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
