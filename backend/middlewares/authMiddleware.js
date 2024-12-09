const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(createError(401, "Token expired"));
    } else if (error.name === "JsonWebTokenError") {
      next(createError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
};

module.exports = { authMiddleware };
