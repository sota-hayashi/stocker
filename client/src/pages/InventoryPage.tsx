import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getInventory, upsertInventory, deleteInventory } from '../api/inventory'
import { getIngredients } from '../api/admin'
import type { InventoryItem, Ingredient } from '../types'

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#555',
  padding: '0',
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 12px' }}>
      <div style={{ flex: 1, borderTop: '1px solid #aaa' }} />
      <span style={{ fontSize: '14px', color: '#666', whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ flex: 1, borderTop: '1px solid #aaa' }} />
    </div>
  )
}

// unitに応じたstepと初期値を返す
function getStepAndDefault(unit: string): { step: number; defaultValue: number } {
  switch (unit) {
    case 'g':
    case 'ml':
      return { step: 50, defaultValue: 100 }
    default:
      return { step: 1, defaultValue: 1 }
  }
}

export default function InventoryPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedIngredientId, setSelectedIngredientId] = useState('')
  const [quantityStr, setQuantityStr] = useState<string>('1')

  // 選択中の食材オブジェクト
  const selectedIngredient = ingredients.find(ing => ing.id === selectedIngredientId)
  const { step, defaultValue } = selectedIngredient
    ? getStepAndDefault(selectedIngredient.unit)
    : { step: 1, defaultValue: 1 }

  // 食材が変わったら初期値をリセット
  useEffect(() => {
    if (selectedIngredient) {
      const { defaultValue: dv } = getStepAndDefault(selectedIngredient.unit)
      setQuantityStr(String(dv))
    }
  }, [selectedIngredientId])

  useEffect(() => {
    if (!token) return
    getInventory(token).then(setInventory)
    getIngredients(token).then(setIngredients)
  }, [token])

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // 先頭の0を除去（例: "007" → "7"）、空文字はそのまま許容
    const cleaned = raw === '' ? '' : String(Number(raw))
    setQuantityStr(cleaned)
  }

  async function handleAdd() {
    if (!token || !selectedIngredientId) return
    const quantity = Number(quantityStr)
    if (!quantity || quantity <= 0) return
    const item = await upsertInventory(token, selectedIngredientId, quantity)
    setInventory(prev => {
      const idx = prev.findIndex(i => i.ingredient_id === item.ingredient_id)
      return idx >= 0 ? prev.map((i, n) => n === idx ? item : i) : [...prev, item]
    })
  }

  async function handleDelete(id: string) {
    if (!token) return
    await deleteInventory(token, id)
    setInventory(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>

      {/* タイトル：横線で挟む */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#333' }}>
          在庫一覧
        </h1>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
      </div>

      {/* ナビゲーション：スラッシュで区切る */}
      <div style={{ textAlign: 'center', marginBottom: '24px', color: '#555', fontSize: '14px' }}>
        <button onClick={() => navigate('/recipes')} style={navButtonStyle}>レシピ提案</button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button onClick={() => navigate('/admin/ingredients')} style={navButtonStyle}>管理</button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button onClick={() => { logout(); navigate('/login') }} style={navButtonStyle}>ログアウト</button>
      </div>

      {/* 在庫追加・更新 */}
      <section style={{ marginBottom: '32px' }}>
        <SectionTitle title="在庫を追加・更新" />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedIngredientId}
            onChange={e => setSelectedIngredientId(e.target.value)}
            style={inputStyle}
          >
            <option value="">食材を選択</option>
            {ingredients.map(ing => (
              <option key={ing.id} value={ing.id}>{ing.name}（{ing.unit}）</option>
            ))}
          </select>
          <input
            type="number"
            min={step}
            step={step}
            value={quantityStr}
            onChange={handleQuantityChange}
            placeholder={String(defaultValue)}
            style={{ ...inputStyle, width: '80px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '6px 16px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            追加・更新
          </button>
        </div>
      </section>

      {/* 現在の在庫 */}
      <section>
        <SectionTitle title="現在の在庫" />
        {inventory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>在庫がありません</p>
        ) : (
          <div style={{ border: '3px double #aaa', borderRadius: '4px' }}>
            {inventory.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderTop: index === 0 ? 'none' : '3px double #aaa',
                }}
              >
                <span style={{ fontSize: '14px', color: '#333' }}>
                  {item.ingredient?.name}：{item.quantity} {item.ingredient?.unit}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#888',
                    padding: '2px 8px',
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}