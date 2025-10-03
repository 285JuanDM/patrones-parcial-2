// Clientes que representan aplicaciones registradas
const clients = [
  {
    clientId: "microservice-client",
    clientSecret: "microservice-secret",
    scopes: ["service.read", "service.write"],
    grantTypes: ["client_credentials"]
  },
  {
    clientId: "frontend-client",
    clientSecret: "frontend-secret",
    scopes: ["user.read", "user.write"],
    grantTypes: ["password", "refresh_token"]
  }
];

// Usuarios finales (para flujo password)
const users = [
  {
    username: "juan",
    password: "1234",
    scopes: ["user.read"]
  },
  {
    username: "admin",
    password: "admin123",
    scopes: ["user.read", "user.write"]
  }
];

// Refresh tokens válidos (se llenará en runtime)
let refreshTokens = [];

module.exports = {
  clients,
  users,
  refreshTokens
};