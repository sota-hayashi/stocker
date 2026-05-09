import { Request, Response } from 'express'
import { db } from '../db'

// --- Ingredients ---

export async function getIngredients(_req: Request, res: Response) {
  const result = await db.query('SELECT * FROM ingredients ORDER BY name')
  res.json(result.rows)
}

export async function createIngredient(req: Request, res: Response) {
  const { name, unit } = req.body
  if (!name || !unit) {
    res.status(400).json({ error: 'name と unit は必須です' })
    return
  }
  const result = await db.query(
    'INSERT INTO ingredients (name, unit) VALUES ($1, $2) RETURNING *',
    [name, unit]
  )
  res.status(201).json(result.rows[0])
}

export async function updateIngredient(req: Request, res: Response) {
  const { id } = req.params
  const { name, unit } = req.body
  const result = await db.query(
    'UPDATE ingredients SET name = $1, unit = $2 WHERE id = $3 RETURNING *',
    [name, unit, id]
  )
  if (result.rows.length === 0) {
    res.status(404).json({ error: '食材が見つかりません' })
    return
  }
  res.json(result.rows[0])
}

export async function deleteIngredient(req: Request, res: Response) {
  const { id } = req.params
  await db.query('DELETE FROM ingredients WHERE id = $1', [id])
  res.status(204).send()
}

// --- Recipes ---

export async function getRecipes(_req: Request, res: Response) {
  const recipes = await db.query('SELECT * FROM recipes ORDER BY name')
  const ingredients = await db.query('SELECT * FROM recipe_ingredients')

  const result = recipes.rows.map((r: { id: string }) => ({
    ...r,
    recipe_ingredients: ingredients.rows.filter((ri: { recipe_id: string }) => ri.recipe_id === r.id),
  }))
  res.json(result)
}

export async function createRecipe(req: Request, res: Response) {
  const { name, description, recipe_ingredients } = req.body
  if (!name) {
    res.status(400).json({ error: 'name は必須です' })
    return
  }

  const recipeResult = await db.query(
    'INSERT INTO recipes (name, description) VALUES ($1, $2) RETURNING *',
    [name, description ?? null]
  )
  const recipe = recipeResult.rows[0]

  if (Array.isArray(recipe_ingredients)) {
    for (const ri of recipe_ingredients as { ingredient_id: string; quantity_per_serving: number; is_required: boolean }[]) {
      await db.query(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_per_serving, is_required) VALUES ($1, $2, $3, $4)',
        [recipe.id, ri.ingredient_id, ri.quantity_per_serving, ri.is_required ?? true]
      )
    }
  }

  res.status(201).json(recipe)
}

export async function updateRecipe(req: Request, res: Response) {
  const { id } = req.params
  const { name, description, recipe_ingredients } = req.body

  const result = await db.query(
    'UPDATE recipes SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description ?? null, id]
  )
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'レシピが見つかりません' })
    return
  }

  if (Array.isArray(recipe_ingredients)) {
    await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id])
    for (const ri of recipe_ingredients as { ingredient_id: string; quantity_per_serving: number; is_required: boolean }[]) {
      await db.query(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_per_serving, is_required) VALUES ($1, $2, $3, $4)',
        [id, ri.ingredient_id, ri.quantity_per_serving, ri.is_required ?? true]
      )
    }
  }

  res.json(result.rows[0])
}

export async function deleteRecipe(req: Request, res: Response) {
  const { id } = req.params
  await db.query('DELETE FROM recipes WHERE id = $1', [id])
  res.status(204).send()
}
