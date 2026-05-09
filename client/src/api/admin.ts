import { Ingredient, RecipeWithIngredients } from '../types'

const BASE = `${import.meta.env.VITE_API_URL}/api/admin`

function headers(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

// Ingredients
export async function getIngredients(token: string): Promise<Ingredient[]> {
  const res = await fetch(`${BASE}/ingredients`, { headers: headers(token) })
  if (!res.ok) throw new Error('食材の取得に失敗しました')
  return res.json()
}

export async function createIngredient(token: string, name: string, unit: string): Promise<Ingredient> {
  const res = await fetch(`${BASE}/ingredients`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ name, unit }),
  })
  if (!res.ok) throw new Error('食材の作成に失敗しました')
  return res.json()
}

export async function updateIngredient(token: string, id: string, name: string, unit: string): Promise<Ingredient> {
  const res = await fetch(`${BASE}/ingredients/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ name, unit }),
  })
  if (!res.ok) throw new Error('食材の更新に失敗しました')
  return res.json()
}

export async function deleteIngredient(token: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/ingredients/${id}`, { method: 'DELETE', headers: headers(token) })
  if (!res.ok) throw new Error('食材の削除に失敗しました')
}

// Recipes
export async function getAdminRecipes(token: string): Promise<RecipeWithIngredients[]> {
  const res = await fetch(`${BASE}/recipes`, { headers: headers(token) })
  if (!res.ok) throw new Error('レシピの取得に失敗しました')
  return res.json()
}

export async function createRecipe(
  token: string,
  payload: { name: string; description?: string; recipe_ingredients: { ingredient_id: string; quantity_per_serving: number; is_required: boolean }[] }
): Promise<RecipeWithIngredients> {
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('レシピの作成に失敗しました')
  return res.json()
}

export async function updateRecipe(
  token: string,
  id: string,
  payload: { name: string; description?: string; recipe_ingredients: { ingredient_id: string; quantity_per_serving: number; is_required: boolean }[] }
): Promise<RecipeWithIngredients> {
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('レシピの更新に失敗しました')
  return res.json()
}

export async function deleteRecipe(token: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/recipes/${id}`, { method: 'DELETE', headers: headers(token) })
  if (!res.ok) throw new Error('レシピの削除に失敗しました')
}
