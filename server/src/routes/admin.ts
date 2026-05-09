import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import {
  getIngredients, createIngredient, updateIngredient, deleteIngredient,
  getRecipes, createRecipe, updateRecipe, deleteRecipe,
} from '../controllers/adminController'

const router = Router()

router.use(authMiddleware)

router.get('/ingredients', getIngredients)
router.post('/ingredients', createIngredient)
router.put('/ingredients/:id', updateIngredient)
router.delete('/ingredients/:id', deleteIngredient)

router.get('/recipes', getRecipes)
router.post('/recipes', createRecipe)
router.put('/recipes/:id', updateRecipe)
router.delete('/recipes/:id', deleteRecipe)

export default router
