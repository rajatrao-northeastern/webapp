const { Router } = require("express");
const { createUser, getUser, getUserByUserID, updateUser, deleteUser } = require("./user.controller");
const router = require("express").Router();



router.post("/", createUser);
router.get("/", getUser);
router.get("/:id", getUserByUserID);
router.patch("/", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;