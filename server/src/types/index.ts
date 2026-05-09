export interface Ingredient {
  id: string
  name: string
  unit: string
}

export interface InventoryItem {
  id: string
  ingredient_id: string
  quantity: number
  updated_at: Date
}

export interface Recipe {
  id: string
  name: string
  description: string | null
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity_per_serving: number
  is_required: boolean
}

export interface JwtPayload {
  userId: string
  email: string
}
