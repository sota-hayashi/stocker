-- Stocker: 家庭向け食材在庫管理・レシピ提案Webアプリ
-- DDL (PostgreSQL)

-- ユーザー
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 食材マスタ
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  unit VARCHAR(20) NOT NULL
);

-- 在庫（世帯共有）
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (ingredient_id)
);

-- レシピマスタ
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- レシピ×食材
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_per_serving NUMERIC(10, 2) NOT NULL CHECK (quantity_per_serving > 0),
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (recipe_id, ingredient_id)
);
