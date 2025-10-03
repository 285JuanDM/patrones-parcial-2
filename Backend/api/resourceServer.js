const express = require("express");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.get("/service", validateToken(["service.read"]), (req, res) => {
  res.json({
    message: "Acceso concedido al microservicio",
    user: req.user
  });
});

router.get("/user", validateToken(["user.read"]), (req, res) => {
  res.json({
    message: "Acceso concedido al usuario final",
    user: req.user
  });
});

module.exports = router;
