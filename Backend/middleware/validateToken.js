const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function validateToken(requiredScopes = []) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid Authorization header format" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = decoded;

      if (requiredScopes.length > 0) {
        const tokenScopes = decoded.scope ? decoded.scope.split(" ") : [];
        const hasScopes = requiredScopes.every(scope => tokenScopes.includes(scope));

        if (!hasScopes) {
          return res.status(403).json({ error: "Insufficient scope" });
        }
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = validateToken;
