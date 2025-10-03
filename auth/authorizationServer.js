const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { clients, users, refreshTokens } = require("../config/data");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const ACCESS_TOKEN_EXPIRATION = "2m";
const REFRESH_TOKEN_EXPIRATION = 5 * 60 * 1000;

function generateAccessToken(payload, scopes) {
  return jwt.sign(
    { ...payload, scope: scopes.join(" ") },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
}

function generateRefreshToken(username) {
  const refreshToken = uuidv4();
  const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRATION;

  refreshTokens.push({ token: refreshToken, username, expiresAt });
  return refreshToken;
}

router.post("/token", (req, res) => {
  const { grant_type, client_id, client_secret, username, password, refresh_token } = req.body;

  const client = clients.find(c => c.clientId === client_id && c.clientSecret === client_secret);
  if (!client) {
    return res.status(401).json({ error: "Invalid client credentials" });
  }

  switch (grant_type) {
    case "client_credentials":
      if (!client.grantTypes.includes("client_credentials")) {
        return res.status(400).json({ error: "Unsupported grant type for this client" });
      }

      const accessTokenCC = generateAccessToken({ client_id }, client.scopes);
      return res.json({
        access_token: accessTokenCC,
        token_type: "Bearer",
        expires_in: ACCESS_TOKEN_EXPIRATION,
        scope: client.scopes.join(" ")
      });

    case "password":
      if (!client.grantTypes.includes("password")) {
        return res.status(400).json({ error: "Unsupported grant type for this client" });
      }

      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        return res.status(401).json({ error: "Invalid user credentials" });
      }

      const accessTokenPW = generateAccessToken({ username }, user.scopes);
      const refreshToken = generateRefreshToken(username);

      return res.json({
        access_token: accessTokenPW,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: ACCESS_TOKEN_EXPIRATION,
        scope: user.scopes.join(" ")
      });

    case "refresh_token":
      if (!client.grantTypes.includes("refresh_token")) {
        return res.status(400).json({ error: "Unsupported grant type for this client" });
      }

      const storedToken = refreshTokens.find(rt => rt.token === refresh_token);
      if (!storedToken) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      if (storedToken.expiresAt < Date.now()) {
        return res.status(401).json({ error: "Refresh token expired" });
      }

      const userFromRT = users.find(u => u.username === storedToken.username);
      if (!userFromRT) {
        return res.status(401).json({ error: "User not found" });
      }

      const newAccessToken = generateAccessToken({ username: userFromRT.username }, userFromRT.scopes);

      return res.json({
        access_token: newAccessToken,
        token_type: "Bearer",
        expires_in: 60,
        scope: userFromRT.scopes.join(" ")
      });

    default:
      return res.status(400).json({ error: "Unsupported grant type" });
  }
});

module.exports = router;
