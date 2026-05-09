import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as authApi from '../api/auth'

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  width: '100%',
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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const { token } = isRegister
        ? await authApi.register(email, password)
        : await authApi.login(email, password)
      login(token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  return (
    <div style={{ padding: '48px 24px', fontFamily: 'sans-serif' }}>

      {/* アプリ名 */}
      <h1 style={{
        textAlign: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '32px',
        letterSpacing: '2px',
      }}>
        Stocker
      </h1>

      {/* ログイン / 新規登録 タイトル */}
      <SectionTitle title={isRegister ? '新規登録' : 'ログイン'} />

      {/* フォーム */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#555' }}>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#555' }}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        {error && (
          <p style={{ fontSize: '13px', color: '#c00', textAlign: 'center' }}>{error}</p>
        )}
      </div>

      {/* ログイン・新規登録ボタン：横並び */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={isRegister ? () => setIsRegister(false) : handleSubmit}
          style={{
            flex: 1,
            padding: '8px 0',
            backgroundColor: isRegister ? '#fff' : '#333',
            color: isRegister ? '#333' : '#fff',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ログイン
        </button>
        <button
          onClick={isRegister ? handleSubmit : () => setIsRegister(true)}
          style={{
            flex: 1,
            padding: '8px 0',
            backgroundColor: isRegister ? '#333' : '#fff',
            color: isRegister ? '#fff' : '#333',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          新規登録
        </button>
      </div>

    </div>
  )
}