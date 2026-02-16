[中文](README.md) | [English](README.en.md) | [日本語](README.ja.md)

![sample1](docs/img/sample1.png)
![sample2](docs/img/sample2.png)

# Assets App

Electron + SQLite（`sql.js`）+ React で構築した、ローカル実行型の個人資産管理デスクトップアプリです。

## 主な機能

- 資産レコード管理（追加・編集・削除・複製）
- 資産タイプ管理（追加・編集・削除、参照保護あり）
- ダッシュボードで最新日付の資産と合計金額を表示
- 日付単位で集計した資産の棒グラフ表示（Canvas）
- CNY -> JPY の為替換算表示（設定可能）

## 技術スタック

- Electron 26
- SQLite（`sql.js` 経由）
- React 18（ローカル静的ランタイム）
- Vanilla CSS（MVP.css）

## ローカル実行

### 1. 依存関係をインストール

```bash
npm install
```

### 2. アプリ起動

```bash
npm start
```

## macOS DMG インストール時の注意

GitHub Release の `.dmg` からインストール後に「app is damaged and can’t be opened」が表示される場合は、次を実行してください。

```bash
xattr -dr com.apple.quarantine /Applications/Asset\ Manager.app/
```

## License

MIT
