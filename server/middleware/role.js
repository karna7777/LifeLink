// Restricts a route to certain roles, e.g. role('staff') or role('admin').
// Must run AFTER the auth middleware (which sets req.user).
module.exports = function role(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed for your role' });
    }
    next();
  };
};
