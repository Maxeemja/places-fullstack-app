const express = require("express");

const router = express.Router();
const { getUsers, signup, login } = require("../controllers/users-controller");
const { check } = require("express-validator");

router.get("/", getUsers);

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
