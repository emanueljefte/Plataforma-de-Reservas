import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from './authorize'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader ||!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token não fornecido'})
}

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded as {
      sub: string
      role: Role
      permissions: string[]
}
    next()
} catch (error) {
    return res.status(401).json({ msg: 'Token inválido ou expirado'})
}
}