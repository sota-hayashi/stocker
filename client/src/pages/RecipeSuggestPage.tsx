import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getSuggestedRecipes } from '../api/recipes'
import type { Recipe } from '../types'

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#555',
  padding: '0',
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

export default function RecipeSuggestPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [servings, setServings] = useState(2)
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    if (!token) return
    getSuggestedRecipes(token, servings).then(setRecipes)
  }, [token, servings])

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>

      {/* タイトル：横線で挟む */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#333' }}>
          レシピ提案
        </h1>
        <div style={{ flex: 1, borderTop: '1px solid #999' }} />
      </div>

      {/* ナビゲーション */}
      <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
        <button onClick={() => navigate('/')} style={navButtonStyle}>
          ← 在庫一覧
        </button>
      </div>

      {/* 人数選択 */}
      <section style={{ marginBottom: '24px' }}>
        <SectionTitle title="今日の人数" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={() => setServings(v => Math.max(1, v - 1))}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            −
          </button>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', minWidth: '32px', textAlign: 'center' }}>
            {servings}
          </span>
          <button
            onClick={() => setServings(v => v + 1)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            ＋
          </button>
        </div>
      </section>

      {/* レシピ一覧 */}
      <section>
        <SectionTitle title="作れるレシピ" />
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>条件に合うレシピがありません</p>
        ) : (
          <div style={{ border: '3px double #aaa', borderRadius: '4px' }}>
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                style={{
                  padding: '12px 16px',
                  borderTop: index === 0 ? 'none' : '3px double #aaa',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/recipes/${recipe.id}`, { state: { servings } })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    {recipe.name}
                  </span>
                  <span style={{ fontSize: '14px', color: '#aaa' }}>›</span>
                </div>
                {recipe.description && (
                  <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                    {recipe.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}