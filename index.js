require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// Importar servidores
const authServer = require("./auth/authorizationServer");
const resourceServer = require("./api/resourceServer");

app.use("/oauth", authServer);
app.use("/api", resourceServer);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
