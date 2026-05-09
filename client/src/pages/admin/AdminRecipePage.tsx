import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getAdminRecipes, createRecipe, updateRecipe, deleteRecipe, getIngredients } from '../../api/admin'
import type { Ingredient, RecipeWithIngredients, RecipeIngredient } from '../../types'

type DraftIngredient = { ingredient_id: string; quantity_per_serving: number; is_required: boolean }

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

export default function AdminRecipePage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [editing, setEditing] = useState<RecipeWithIngredients | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [draftIngredients, setDraftIngredients] = useState<DraftIngredient[]>([])

  useEffect(() => {
    if (!token) return
    getAdminRecipes(token).then(setRecipes)
    getIngredients(token).then(setIngredients)
  }, [token])

  function startEdit(recipe: RecipeWithIngredients) {
    setEditing(recipe)
    setName(recipe.name)
    setDescription(recipe.description ?? '')
    setDraftIngredients(recipe.recipe_ingredients.map((ri: RecipeIngredient) => ({
      ingredient_id: ri.ingredient_id,
      quantity_per_serving: ri.quantity_per_serving,
      is_required: ri.is_required,
    })))
  }

  function resetForm() {
    setEditing(null)
    setName('')
    setDescription('')
    setDraftIngredients([])
  }

  function addDraftIngredient() {
    if (ingredients.length === 0) return
    setDraftIngredients(prev => [...prev, { ingredient_id: ingredients[0].id, quantity_per_serving: 1, is_required: true }])
  }

  function updateDraftIngredient(idx: number, patch: Partial<DraftIngredient>) {
    setDraftIngredients(prev => prev.map((di, i) => i === idx ? { ...di, ...patch } : di))
  }

  function removeDraftIngredient(idx: number) {
    setDraftIngredients(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    const payload = { name, description, recipe_ingredients: draftIngredients }
    if (editing) {
      const updated = await updateRecipe(token, editing.id, payload)
      setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r))
    } else {
      const created = await createRecipe(token, payload)
      setRecipes(prev => [...prev, created])
    }
    resetForm()
  }

  async function handleDelete(id: string) {
    if (!token) return
    await deleteRecipe(token, id)
    setRecipes(prev => prev.filter(r => r.id !== id))
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
      <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555', padding: '0' }}
        >
          トップ
        </button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button
          onClick={() => navigate('/admin/ingredients')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555', padding: '0' }}
        >
          食材管理
        </button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button
          onClick={() => navigate('/admin/recipes')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#333', padding: '0', fontWeight: 'bold', borderBottom: '1px solid #333' }}
        >
          レシピ管理
        </button>
      </div>

      {/* 新規追加・編集フォーム */}
      <section style={{ marginBottom: '32px' }}>
        <SectionTitle title={editing ? '編集' : '新規追加'} />
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <input
              placeholder="レシピ名"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="説明（任意）"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
            />
          </div>

          {/* 使用食材 */}
          <SectionTitle title="使用食材" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            {draftIngredients.map((di, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: '#fafafa',
                }}
              >
                <select
                  value={di.ingredient_id}
                  onChange={e => updateDraftIngredient(idx, { ingredient_id: e.target.value })}
                  style={inputStyle}
                >
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}（{ing.unit}）</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={di.quantity_per_serving}
                  onChange={e => updateDraftIngredient(idx, { quantity_per_serving: Number(e.target.value) })}
                  style={{ ...inputStyle, width: '80px' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#555', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={di.is_required}
                    onChange={e => updateDraftIngredient(idx, { is_required: e.target.checked })}
                  />
                  必須
                </label>
                <button
                  type="button"
                  onClick={() => removeDraftIngredient(idx)}
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

          <button
            type="button"
            onClick={addDraftIngredient}
            style={{
              padding: '6px 16px',
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            ＋ 食材を追加
          </button>

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

      {/* レシピ一覧 */}
      <section>
        <SectionTitle title="レシピ一覧" />
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>レシピがありません</p>
        ) : (
          <div style={{ border: '3px double #aaa', borderRadius: '4px' }}>
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderTop: index === 0 ? 'none' : '3px double #aaa',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>{recipe.name}</span>
                  {recipe.description && (
                    <span style={{ fontSize: '13px', color: '#888', marginLeft: '8px' }}>：{recipe.description}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(recipe)}
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
                    onClick={() => handleDelete(recipe.id)}
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