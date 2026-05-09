const BASE = `${import.meta.env.VITE_API_URL}/api/auth`

export async function register(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
}
