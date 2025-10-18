import { Request, Response, NextFunction} from 'express'

export type Role = 'Provider' | 'Client'

const rolePermissions: Record<Role, string[]> = {
  Provider: ['create', 'read', 'update', 'delete'],
  Client: ['create', 'read', 'update', 'delete'],
}

export const authorize = (
  requiredPermissions: string[] = [],
  allowedRole: Role | null = null
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role} = req.user! // agora o TypeScript aceita

    if (allowedRole && role!== allowedRole) {
      return res
.status(403)
.json({ msg: 'Acesso restrito à role: ' + allowedRole})
}

    const userPermissions = rolePermissions[role] || []

    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p)
)

    if (!hasPermission) {
      return res.status(403).json({ msg: 'Permissão negada para esta ação'})
}

    next()
}
}
