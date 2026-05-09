import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db'

export async function register(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'メールアドレスとパスワードは必須です' })
    return
  }

  const password_hash = await bcrypt.hash(password, 10)
  const result = await db.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, password_hash]
  )
  const user = result.rows[0]
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  res.status(201).json({ token })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'メールアドレスとパスワードは必須です' })
    return
  }

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' })
    return
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  res.json({ token })
}
