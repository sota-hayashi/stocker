import { Request, Response } from 'express'
import { db } from '../db'

export async function getInventory(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT inv.id, inv.ingredient_id, inv.quantity, inv.updated_at,
            ing.name, ing.unit
     FROM inventory inv
     JOIN ingredients ing ON ing.id = inv.ingredient_id
     ORDER BY ing.name`
  )
  const rows = result.rows.map(row => ({
    id: row.id,
    ingredient_id: row.ingredient_id,
    quantity: row.quantity,
    updated_at: row.updated_at,
    ingredient: {
      name: row.name,
      unit: row.unit,
    }
  }))
  res.json(rows)
}

export async function upsertInventory(req: Request, res: Response) {
  const { ingredient_id, quantity } = req.body
  if (!ingredient_id || quantity == null) {
    res.status(400).json({ error: 'ingredient_id と quantity は必須です' })
    return
  }

  await db.query(
    `INSERT INTO inventory (ingredient_id, quantity)
     VALUES ($1, $2)
     ON CONFLICT (ingredient_id)
     DO UPDATE SET quantity = $2, updated_at = NOW()`,
    [ingredient_id, quantity]
  )

  const result = await db.query(
    `SELECT inv.id, inv.ingredient_id, inv.quantity, inv.updated_at,
            ing.name, ing.unit
     FROM inventory inv
     JOIN ingredients ing ON ing.id = inv.ingredient_id
     WHERE inv.ingredient_id = $1`,
    [ingredient_id]
  )

  const row = result.rows[0]
  res.json({
    id: row.id,
    ingredient_id: row.ingredient_id,
    quantity: row.quantity,
    updated_at: row.updated_at,
    ingredient: {
      name: row.name,
      unit: row.unit,
    }
  })
}

export async function deleteInventory(req: Request, res: Response) {
  const { id } = req.params
  await db.query('DELETE FROM inventory WHERE id = $1', [id])
  res.status(204).send()
}
