import { InventoryItem } from '../types'

const BASE = `${import.meta.env.VITE_API_URL}/api/inventory`

function headers(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getInventory(token: string): Promise<InventoryItem[]> {
  const res = await fetch(BASE, { headers: headers(token) })
  if (!res.ok) throw new Error('在庫の取得に失敗しました')
  return res.json()
}

export async function upsertInventory(
  token: string,
  ingredient_id: string,
  quantity: number
): Promise<InventoryItem> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ ingredient_id, quantity }),
  })
  if (!res.ok) throw new Error('在庫の更新に失敗しました')
  return res.json()
}

export async function deleteInventory(token: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: headers(token) })
  if (!res.ok) throw new Error('在庫の削除に失敗しました')
}
