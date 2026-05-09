import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from '../../api/admin'
import type { Ingredient } from '../../types'

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

export default function AdminIngredientPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [editing, setEditing] = useState<Ingredient | null>(null)
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')

  useEffect(() => {
    if (!token) return
    getIngredients(token).then(setIngredients)
  }, [token])

  function startEdit(ing: Ingredient) {
    setEditing(ing)
    setName(ing.name)
    setUnit(ing.unit)
  }

  function resetForm() {
    setEditing(null)
    setName('')
    setUnit('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    if (editing) {
      const updated = await updateIngredient(token, editing.id, name, unit)
      setIngredients(prev => prev.map(i => i.id === updated.id ? updated : i))
    } else {
      const created = await createIngredient(token, name, unit)
      setIngredients(prev => [...prev, created])
    }
    resetForm()
  }

  async function handleDelete(id: string) {
    if (!token) return
    await deleteIngredient(token, id)
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>

      {/* タイトル：横線で挟む */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#333' }}>
          管理
        </h1>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
      </div>

      {/* ナビゲーション：スラッシュで区切る・現在地に下線 */}
      <div style={{ textAlign: 'center', marginBottom: '24px', color: '#555', fontSize: '14px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555', padding: '0' }}
        >
          トップ
        </button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button
          onClick={() => navigate('/admin/ingredients')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#333', padding: '0', fontWeight: 'bold', borderBottom: '1px solid #333' }}
        >
          食材管理
        </button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button
          onClick={() => navigate('/admin/recipes')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555', padding: '0' }}
        >
          レシピ管理
        </button>
      </div>

      {/* 新規追加・編集フォーム */}
      <section style={{ marginBottom: '32px' }}>
        <SectionTitle title={editing ? '編集' : '新規追加'} />
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <input
              placeholder="食材名"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="単位（例：g, 個）"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              required
              style={{ ...inputStyle, width: '120px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
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
              {editing ? '更新' : '追加'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#fff',
                  color: '#333',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </section>

      {/* 食材一覧 */}
      <section>
        <SectionTitle title="食材一覧" />
        {ingredients.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>食材がありません</p>
        ) : (
          <div style={{ border: '3px double #aaa', borderRadius: '4px' }}>
            {ingredients.map((ing, index) => (
              <div
                key={ing.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderTop: index === 0 ? 'none' : '3px double #aaa',
                }}
              >
                <span style={{ fontSize: '14px', color: '#333' }}>
                  {ing.name}（{ing.unit}）
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(ing)}
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
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(ing.id)}
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}