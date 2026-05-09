export interface Ingredient {
  id: string
  name: string
  unit: string
}

export interface InventoryItem {
  id: string
  ingredient_id: string
  quantity: number
  ingredient: Ingredient
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
  ingredient?: Ingredient
}

export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients: RecipeIngredient[]
}

export interface User {
  id: string
  email: string
}
