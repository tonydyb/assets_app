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

## プロジェクト構成

```text
assets_app/
├─ main.js                     # Electron エントリと IPC 登録
├─ preload.js                  # セキュアブリッジ API（window.api）
├─ main/
│  ├─ assetService.js          # ビジネスロジック
│  ├─ database.js              # sql.js ラッパーと永続化
│  └─ config.js                # 設定（例: 為替レート）
├─ renderer/
│  ├─ dashboard.html
│  ├─ assets.html
│  ├─ add_asset.html
│  ├─ asset_types.html
│  ├─ chart.html
│  ├─ app-react.js             # React UI ロジック
│  ├─ vendor/                  # ローカル React ランタイム
│  └─ mvp.css
├─ data/
│  └─ assets.db                # SQLite DB ファイル
└─ docs/
   ├─ 01.SRS.md
   ├─ 02.HLD.md
   ├─ 03.DDL.md
   ├─ 04.LLD.md
   ├─ 05.UI 设计文档.md
   └─ ADR/
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

## データ

- DB ファイル: `data/assets.db`
- テーブル: `asset_types`, `assets`
- 書き込み操作後に DB ファイルへ永続化

## ドキュメント

- 要件: `/assets_app/docs/01.SRS.md`
- アーキテクチャ: `/assets_app/docs/02.HLD.md`
- データベース: `/assets_app/docs/03.DDL.md`
- 詳細設計: `/assets_app/docs/04.LLD.md`
- UI 設計: `/assets_app/docs/05.UI 设计文档.md`
- ADR: `/assets_app/docs/ADR`

## Roadmap

- エラーコードとエラーハンドリング規約の統一
- CSV エクスポート
- バックアップ/リストア
- フィルタリングとページネーション

## License

MIT
