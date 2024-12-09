const createError = require('http-errors'); 

const roleMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    try {

      const role = req.userRole;
      const hasRequiredRoles = requiredRoles.includes(role);

      if (!hasRequiredRoles) {
        throw createError(403, 'Forbidden: Insufficient role permissions');
      }

      next();
    } catch (error) {
      res.send(error);
    }
  };
};

module.exports = roleMiddleware;
