const rolePermissions = {
  provider: ['create', 'read', 'update', 'delete'],
  client: ['create', 'read', 'update', 'delete'],
}

export const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    const { role} = req.user

    const userPermissions = rolePermissions[role] || []

    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p))

    if (!hasPermission) {
      return res.status(403).json({ msg: 'Permissão negada para esta ação'})
}

    next()
}
}