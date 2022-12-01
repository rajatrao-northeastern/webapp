const router = require('express').Router();
const baseAuthentication = require('../util/auth.js');
const userController = require('../Controller/usersController.js');
const docController = require('../Controller/docController');
const multer = require('multer');
const dbConfig = require('../config/configDB.js');
const logger = require("../config/logger");
const SDC = require('statsd-client');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});
var start = new Date();

// GET Method

router.get("/healthz", (req, res) => {
    console.log("Connected to API")
    sdc.timing('health.timeout', start);
    logger.info("/healthz working as expected");
    sdc.increment('endpoint.health');
    res.sendStatus(200).json();
});

// POST Method

router.post("/v1/account", userController.createUser);

// GET Method (With Authentication)

router.get("/v1/account/:id", baseAuthentication() , userController.getUser);

// PUT Method

router.put("/v1/account/:id", baseAuthentication() , userController.updateUser);


const upload = multer({
    dest: 'uploads/'
})

router.post("/v1/documents", baseAuthentication(), upload.single('file'), docController.updateUserDoc);

// Get Doc

router.get("/v1/documents/:id", baseAuthentication(), docController.getUserDoc);

//Get All Docs

router.get("/v1/documents", baseAuthentication(), docController.getUserDocAll);

// Delete Doc

router.delete("/v1/documents/:id", baseAuthentication(), docController.deleteUserDoc);


// Verify User
router.get("/v1/verify", userController.verifyUser);


module.exports = router;
