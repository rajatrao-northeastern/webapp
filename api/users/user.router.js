// const { Router } = require("express");
// const { createUser, getUser, getUserByUserID, updateUser, deleteUser } = require("./user.controller");
// const router = require("express").Router();
// //const { user } = require('../../models/index')

// router.post("/", createUser);
// router.get("/", getUser);
// router.get("/:id", getUserByUserID);
// router.patch("/", updateUser);
// router.delete("/:id", deleteUser);

// module.exports = router;

module.exports = app => {
    const users = require("../users/user.controller.js");

    var router = require("express").Router();

  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/user", users.findAllUser);
  router.get("/:id", users.findOne);
  router.put("/:id", users.update);
  router.delete("/:id", users.delete);
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};