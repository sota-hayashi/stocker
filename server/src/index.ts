import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import inventoryRoutes from './routes/inventory'
import recipesRoutes from './routes/recipes'
import adminRoutes from './routes/admin'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/recipes', recipesRoutes)
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
