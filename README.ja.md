[中文](README.md) | [English](README.en.md) | [日本語](README.ja.md)

![sample1](docs/img/sample1.png)
![sample2](docs/img/sample2.png)

# Asset Manager

Electron + SQLite（`sql.js`）+ React で構築した、ローカル実行型の個人資産管理デスクトップアプリです。定期的な資産スナップショット管理を想定しており、日付ごとの資産構成を記録し、表示通貨へ換算した合計資産を Dashboard と Chart で確認できます。

## 主な機能

- Dashboard で最新日付の資産スナップショットと総資産を表示。
- 表示通貨で総資産を計算。`JPY`、`CNY`、`USD` に対応。
- 手動為替レートを管理し、Dashboard / Chart の換算に使用。
- 資産レコード管理：追加、編集、削除、複製。
- 資産タイプ管理：追加、編集、削除、`Region` フィールド対応。
- `Add New Rebalance`：最新の資産スナップショットから資産タイプと通貨をコピーし、新しい日付の最新金額を入力。
- 日付単位で集計した資産の棒グラフ表示（Canvas）。
- Settings で言語、表示通貨、FX キャッシュ日数、手動為替レート、ローカルインポート / エクスポートを管理。
- ローカル `.db` インポート時にデータベースを検証。旧バージョンのエクスポート DB は migration により最新 schema へ互換化。
- 多言語 UI：中国語、English、日本語。

## データと互換性

- データはローカル SQLite データベースに保存されます。
- 開発環境のデフォルト DB パス：`data/assets.db`。
- パッケージ版 macOS アプリでは Electron の `userData` ディレクトリ内の `assets.db` を使用します。
- migration は `main/migrations/` にあります。
- 旧 `assets.name` カラムは互換性のため残していますが、UI では Asset Name を表示・編集しません。
- `asset_types.region` は新しいフィールドで、旧 DB インポート時に migration で追加されます。

## 技術スタック

- Electron 26
- SQLite（`sql.js` 経由）
- React 18（ローカル静的ランタイム）
- Canvas chart
- Vanilla CSS（`renderer/styles/` に分割）

## プロジェクト構成

```text
main/                    Electron メインプロセス、DB、サービスロジック
main/migrations/          SQLite migration SQL
preload.js                Renderer に公開する安全な API
renderer/*.html           各ページの HTML シェル
renderer/app-react.js     軽量 React 起動エントリ
renderer/src/             Renderer React モジュール
renderer/src/pages/       Dashboard / Assets / Settings などのページコンポーネント
renderer/src/components/  App shell、ナビゲーション、フッターなどの共有コンポーネント
renderer/styles/          tokens / reset / base / layout / components / pages スタイル
openspec/changes/         機能・リファクタリング仕様
```

## ローカル実行

### 1. 依存関係をインストール

```bash
npm install
```

### 2. アプリ起動

```bash
npm start
```

## パッケージ作成

```bash
npm run pack
```

配布用インストーラーを生成：

```bash
npm run dist
```

## macOS DMG インストール時の注意

GitHub Release の `.dmg` からインストール後に「app is damaged and can’t be opened」が表示される場合は、次を実行してください。

```bash
xattr -dr com.apple.quarantine /Applications/Asset\ Manager.app/
```

## License

MIT
