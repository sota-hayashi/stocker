import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRecipeDetail, cookRecipe } from '../api/recipes'
import type { RecipeWithIngredients } from '../types'

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 12px' }}>
      <div style={{ flex: 1, borderTop: '1px solid #aaa' }} />
      <span style={{ fontSize: '14px', color: '#666', whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ flex: 1, borderTop: '1px solid #aaa' }} />
    </div>
  )
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null)
  const servings: number = (state as { servings?: number })?.servings ?? 2

  useEffect(() => {
    if (!token || !id) return
    getRecipeDetail(token, id).then(setRecipe)
  }, [token, id])

  async function handleCook() {
    if (!token || !id) return
    await cookRecipe(token, id, servings)
    navigate('/')
  }

  if (!recipe) return (
    <p style={{ textAlign: 'center', color: '#999', fontFamily: 'sans-serif', marginTop: '48px' }}>
      読み込み中...
    </p>
  )

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>

      {/* タイトル：横線で挟む */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#333' }}>
          {recipe.name}
        </h1>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
      </div>

      {/* ナビゲーション */}
      <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555', padding: '0' }}
        >
          ← 戻る
        </button>
      </div>

      {/* 説明文 */}
      {recipe.description && (
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px', textAlign: 'center' }}>
          {recipe.description}
        </p>
      )}

      {/* 食材テーブル */}
      <section>
        <SectionTitle title={`食材（${servings}人前）`} />
        <div style={{ border: '3px double #aaa', borderRadius: '4px' }}>
          {/* ヘッダー */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            fontSize: '12px',
            color: '#888',
            borderBottom: '3px double #aaa',
          }}>
            <span>食材</span>
            <span style={{ textAlign: 'right' }}>1人前</span>
            <span style={{ textAlign: 'right' }}>{servings}人前</span>
            <span style={{ textAlign: 'right' }}>区分</span>
          </div>
          {/* 行 */}
          {recipe.recipe_ingredients.map((ri, index) => (
            <div
              key={ri.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '10px 16px',
                borderTop: index === 0 ? 'none' : '3px double #aaa',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '14px', color: '#333' }}>
                {ri.ingredient?.name ?? ri.name}
              </span>
              <span style={{ fontSize: '14px', color: '#555', textAlign: 'right' }}>
                {ri.quantity_per_serving} {ri.ingredient?.unit ?? ri.unit}
              </span>
              <span style={{ fontSize: '14px', color: '#333', textAlign: 'right' }}>
                {ri.quantity_per_serving * servings} {ri.ingredient?.unit}
              </span>
              <span style={{
                fontSize: '12px',
                textAlign: 'right',
                color: ri.is_required ? '#333' : '#999',
              }}>
                {ri.is_required ? '必須' : '任意'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 作るボタン */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={handleCook}
          style={{
            padding: '10px 32px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          作る（{servings}人前）
        </button>
      </div>

    </div>
  )
}