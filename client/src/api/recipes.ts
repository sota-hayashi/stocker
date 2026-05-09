import { Recipe, RecipeWithIngredients } from '../types'

const BASE = '/api/recipes'

function authHeader(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getSuggestedRecipes(token: string, servings: number): Promise<Recipe[]> {
  const res = await fetch(`${BASE}?servings=${servings}`, { headers: authHeader(token) })
  if (!res.ok) throw new Error('レシピの取得に失敗しました')
  return res.json()
}

export async function getRecipeDetail(token: string, id: string): Promise<RecipeWithIngredients> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeader(token) })
  if (!res.ok) throw new Error('レシピの取得に失敗しました')
  return res.json()
}

export async function cookRecipe(token: string, id: string, servings: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}/cook`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ servings }),
  })
  if (!res.ok) throw new Error('レシピの実行に失敗しました')
}
