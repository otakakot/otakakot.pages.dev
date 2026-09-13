# Astro プロジェクト構成 & クライアントスクリプト設計調査メモ

本ドキュメントは、Astro におけるデファクトスタンダードなディレクトリ構成、およびクライアントサイドスクリプト（`<script>`）の仕様について調査した結果をまとめたメモです。

---

## 1. Astro 標準のプロジェクト構造

Astro 公式ドキュメントでは、明確な思想に基づいたオピニオン（規約）としてのディレクトリ構造が示されています。

> **公式ソース**: [Astro Docs: Project Structure](https://docs.astro.build/en/basics/project-structure/)

```text
├── public/                 # ビルド・最適化を通さずそのまま配信する静的資産（robots.txt, favicon 等）
├── src/
│   ├── assets/             # Astro が最適化・変換を行う画像やフォントなどのローカル資産
│   ├── components/         # 再利用可能な UI コンポーネント（.astro / React / Vue など）
│   ├── layouts/            # 共通骨組み（<html>, <head>, SEO メタタグなどを提供するテンプレート）
│   ├── pages/              # ファイルベースルーティング（URL と 1 対 1 に対応する必須ディレクトリ）
│   ├── styles/             # グローバル CSS / リセット CSS など
│   └── api/ (または lib/)  # 純粋な TypeScript ロジック（API クライアント、ユーティリティ、型定義）
├── astro.config.mjs        # Astro の設定ファイル
├── package.json
└── tsconfig.json
```

### ディレクトリの責務分離

| ディレクトリ | 役割と責務 | 特徴・プラクティス |
| :--- | :--- | :--- |
| `src/pages/` | ルーティングとページ定義 | URL に直接対応。レイアウトとコンポーネントを配置するのみにとどめ、内部ロジックは薄く保つ |
| `src/components/` | UI コンポーネント | HTML マークアップ、Scoped CSS、および必要なクライアントサイド制御（`<script>`）をカプセル化 |
| `src/layouts/` | ページ共通の骨格 | ページ全体のラッパー。`<slot />` を介して各ページコンテンツをレンダリング |
| `src/api/` | 外部通信・API クライアント | DOM に依存しない純粋な fetch 処理、リクエスト/レスポンス型定義、カスタムエラークラスの集約 |

---

## 2. クライアントスクリプト（`<script>`）の設計思想

Astro においてクライアント側のイベント処理やインタラクションを実装する際、別フォルダ（例: `src/scripts/`）にスクリプトを外出しするのではなく、**`.astro` コンポーネント内の `<script>` タグに直接記述することが標準プラクティス** とされています。

> **公式ソース**: [Astro Docs: Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/)

### なぜコンポーネント内に書くのか？

#### ① スクリプトの重複排除（Deduplication）
Astro は、コンポーネント内に書かれた標準の `<script>`（属性なしまたは TypeScript）をビルド時に解析します。
1 つのページ内に同じコンポーネントが複数回呼び出されても、**スクリプトはページ内で 1 回だけ出力・実行** されるよう自動的に重複排除されます。

```astro
<!-- src/components/AlertButton.astro -->
<button data-alert>Click</button>

<script>
  // ページ内に <AlertButton /> が 10 個あっても、このスクリプトは 1 回のみ実行される
  const buttons = document.querySelectorAll('[data-alert]');
  buttons.forEach(btn => btn.addEventListener('click', () => alert('Clicked!')));
</script>
```

#### ② 自動トランスパイル・バンドル・依存解決
- TypeScript をそのまま記述可能（追加の設定なし）。
- `import { signin } from '../api'` のようにローカルモジュールや npm パッケージを直接インポート可能。
- Vite を通して最小限のバンドルサイズに最適化されます。

#### ③ 高い凝集度（Single File Component）
マークアップ・スタイル・挙動（スクリプト）が 1 つのファイルに完結するため、修正やコンポーネントの移動・削除が安全かつ容易になります。

---

本ドキュメントは、以下の AI アシスタント（LLM）によって調査・作成されました。

- **AI アシスタント**: Antigravity (Google DeepMind)
- **基盤モデル**: Gemini 3.8 Flash
- **作成日**: 2026-09-13
