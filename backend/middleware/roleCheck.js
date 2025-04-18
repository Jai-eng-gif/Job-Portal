
export default function roleCheck(allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access Denied' });
      }
      next();
    };
  }
  