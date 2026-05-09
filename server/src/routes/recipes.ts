import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getSuggestedRecipes, getRecipeDetail, cookRecipe } from '../controllers/recipesController'

const router = Router()

router.use(authMiddleware)

router.get('/', getSuggestedRecipes)
router.get('/:id', getRecipeDetail)
router.post('/:id/cook', cookRecipe)

export default router
