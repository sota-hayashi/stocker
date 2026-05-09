# Stocker: ディレクトリ構成

```
stocker/
├── package.json              # monorepo ルートの設定
├── .gitignore
├── README.md
│
├── client/                   # フロントエンド（React / TypeScript）
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/              # バックエンドへのAPIリクエスト関数
│       ├── components/       # 共通UIコンポーネント
│       ├── pages/            # 画面単位のコンポーネント
│       │   ├── LoginPage.tsx
│       │   ├── InventoryPage.tsx
│       │   ├── RecipeSuggestPage.tsx
│       │   ├── RecipeDetailPage.tsx
│       │   └── admin/
│       │       ├── AdminIngredientPage.tsx
│       │       └── AdminRecipePage.tsx
│       ├── hooks/            # カスタムフック
│       └── types/            # 型定義
│
└── server/                   # バックエンド（Express / TypeScript）
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts          # エントリーポイント
        ├── db.ts             # PostgreSQL接続設定
        ├── routes/           # APIルーティング
        │   ├── auth.ts
        │   ├── inventory.ts
        │   ├── recipes.ts
        │   └── admin.ts
        ├── controllers/      # ルートから呼ばれるビジネスロジック
        │   ├── authController.ts
        │   ├── inventoryController.ts
        │   ├── recipesController.ts
        │   └── adminController.ts
        ├── middlewares/      # 認証チェックなどのミドルウェア
        │   └── authMiddleware.ts
        └── types/            # 型定義
```
