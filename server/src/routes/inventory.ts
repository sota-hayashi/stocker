import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getInventory, upsertInventory, deleteInventory } from '../controllers/inventoryController'

const router = Router()

router.use(authMiddleware)

router.get('/', getInventory)
router.post('/', upsertInventory)
router.delete('/:id', deleteInventory)

export default router
