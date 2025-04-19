
export default function roleCheck(allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.user.role)) {
        console.log(req.user.user.role);
        
        return res.status(403).json({ msg: 'Access Denied' });
      }
      next();
    };
  }
  