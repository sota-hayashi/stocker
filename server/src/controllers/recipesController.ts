import { Request, Response } from 'express'
import { db } from '../db'

export async function getSuggestedRecipes(req: Request, res: Response) {
  const servings = Number(req.query.servings ?? 1)

  const inventoryResult = await db.query(
    `SELECT ingredient_id, quantity FROM inventory`
  )
  const inventory = new Map<string, number>(
    inventoryResult.rows.map((r: { ingredient_id: string; quantity: number }) => [r.ingredient_id, r.quantity])
  )

  const recipesResult = await db.query(
    `SELECT r.id, r.name, r.description,
            ri.ingredient_id, ri.quantity_per_serving, ri.is_required
     FROM recipes r
     JOIN recipe_ingredients ri ON ri.recipe_id = r.id`
  )

  type RiRow = { id: string; name: string; description: string | null; ingredient_id: string; quantity_per_serving: number; is_required: boolean }
  const recipeMap = new Map<string, { id: string; name: string; description: string | null; required: RiRow[]; optional: RiRow[] }>()
  for (const row of recipesResult.rows as RiRow[]) {
    if (!recipeMap.has(row.id)) recipeMap.set(row.id, { id: row.id, name: row.name, description: row.description, required: [], optional: [] })
    const recipe = recipeMap.get(row.id)!
    if (row.is_required) recipe.required.push(row)
    else recipe.optional.push(row)
  }

  const suggested = []
  for (const recipe of recipeMap.values()) {
    const requiredOk = recipe.required.every(
      ri => (inventory.get(ri.ingredient_id) ?? 0) >= ri.quantity_per_serving * servings
    )
    if (!requiredOk) continue

    if (recipe.optional.length > 0) {
      const optionalOk = recipe.optional.some(
        ri => (inventory.get(ri.ingredient_id) ?? 0) >= ri.quantity_per_serving * servings
      )
      if (!optionalOk) continue
    }

    suggested.push({ id: recipe.id, name: recipe.name, description: recipe.description })
  }

  res.json(suggested)
}

export async function getRecipeDetail(req: Request, res: Response) {
  const { id } = req.params
  const recipeResult = await db.query('SELECT * FROM recipes WHERE id = $1', [id])
  if (recipeResult.rows.length === 0) {
    res.status(404).json({ error: 'レシピが見つかりません' })
    return
  }

  const ingredientsResult = await db.query(
    `SELECT ri.*, ing.name, ing.unit
     FROM recipe_ingredients ri
     JOIN ingredients ing ON ing.id = ri.ingredient_id
     WHERE ri.recipe_id = $1`,
    [id]
  )

  res.json({ ...recipeResult.rows[0], recipe_ingredients: ingredientsResult.rows })
}

export async function cookRecipe(req: Request, res: Response) {
  const { id } = req.params
  const servings = Number(req.body.servings ?? 1)

  const ingredientsResult = await db.query(
    'SELECT * FROM recipe_ingredients WHERE recipe_id = $1',
    [id]
  )

  for (const ri of ingredientsResult.rows as { ingredient_id: string; quantity_per_serving: number }[]) {
    const used = ri.quantity_per_serving * servings
    await db.query(
      'UPDATE inventory SET quantity = quantity - $1, updated_at = NOW() WHERE ingredient_id = $2',
      [used, ri.ingredient_id]
    )
    await db.query('DELETE FROM inventory WHERE ingredient_id = $1 AND quantity <= 0', [ri.ingredient_id])
  }

  res.status(204).send()
}
