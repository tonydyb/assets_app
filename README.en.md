# Assets App

[中文](README.md) | [English](README.en.md) | [日本語](README.ja.md)

![sample1](docs/img/sample1.png)
![sample2](docs/img/sample2.png)

A local desktop personal asset management app built with Electron + SQLite (`sql.js`) + React.

## Features

- Asset record management (create, edit, delete, duplicate)
- Asset type management (create, edit, delete, with usage protection)
- Dashboard with latest-date assets and total amount
- Date-aggregated asset bar chart (Canvas)
- CNY -> JPY conversion for display (configurable)

## Tech Stack

- Electron 26
- SQLite (via `sql.js`)
- React 18 (local static runtime files)
- Vanilla CSS (MVP.css)

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start app

```bash
npm start
```

## macOS DMG Note

If you installed from a GitHub Release `.dmg` and see “app is damaged and can’t be opened”, run:

```bash
xattr -dr com.apple.quarantine /Applications/Asset\ Manager.app/
```

## License

MIT
