const db = require('../config/sequelizeDB.js');
const User = db.users;
const Doc = db.docs;
const bcrypt = require('bcrypt');
const {
    v4: uuidv4
} = require('uuid');
const multer = require('multer');
const path = require('path');
const fileService = require('../services/file');
const AWS = require('aws-sdk');
const fs = require('fs');
const logger = require("../config/logger");
const SDC = require('statsd-client');
const dbConfig = require('../config/configDB.js');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});


//Creating a new instance of S3:
AWS.config.update({
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
//const bucket = process.env.AWS_BUCKET_NAME;

// Update doc

async function updateUserDoc(req, res, next) {
    logger.info("inside updateUserDoc function");
    const user = await getUserByUsername(req.user.username);
    // var doc = await Doc.findOne({
    //     where: {
    //         user_id: user.id
    //     }
    // });

    // if (doc) {
    //     var del = await fileService.deleteFile(s3, doc);
    //     if (del) {

    //     } else {
    //         res.status(404).send({
    //             message: 'error deleting'
    //         });
    //     }
    // }

    if (!req.file) {
        res.status(400).send({
            message: 'No File Uploaded!'
        });
        console.log("No File Uploaded..!");
     }

    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimetype = filetypes.test(req.file.mimetype);

    if (!mimetype && !extname) {
        logger.error("Doc File Not Supported");
        res.status(400).send({
            message: 'Unsupported File Type'
        });
        console.log("Unsupported File Format..!");

    } else {

        const fileId = uuidv4();
        const fileName = path.basename(req.file.originalname, path.extname(req.file.originalname)) + path.extname(req.file.originalname);
        console.log('fileName: ', fileName)
        await fileService.fileUpload(req.file.path, fileName, s3, fileId, req, res);

    }

}

// Get doc

async function getUserDoc(req, res, next) {
    let id = req.params.id
    logger.info("inside getUserDoc function");
    const user = await getUserByUsername(req.user.username);
    logger.info("after getUserByUsername function");
    console.log(user)
    var doc = await Doc.findOne({
        where: {
            user_id: user.id, id: id
        }
    });

    if (doc) {
        res.status(200).send({
            file_name: doc.file_name,
            id: doc.id,
            url: doc.url,
            upload_date: doc.upload_date,
            user_id: doc.user_id
        });
    } else {
        logger.error("No Doc found !");
        res.status(400).send({
            message: 'No Doc found!'
        });
    }
}

async function getUserDocAll(req, res, next) {
    // let id = req.params.id
    const user = await getUserByUsername(req.user.username);
    console.log(user)
    var doc = await Doc.findAll({
        where: {
            user_id: user.id
        }
    });
    doc.forEach(d => {
        for (let key in d) {
          console.log(`${key}: ${d[key]}`)
        }
      });

    if (doc) {
        res.status(200).json(doc);

    } else {
        res.status(404).send({
            message: 'No Doc found!'
        });
    }
}

// Delete doc

async function deleteUserDoc(req, res, next) {
    let id = req.params.id
    logger.info("inside deleteUserDoc function");
    const user = await getUserByUsername(req.user.username);
    logger.info("after getUserByUsername function");

    var doc = await Doc.findOne({
        where: {
            user_id: user.id, id: id
        }
    });

    if (doc) {
        console.log('delete doc', doc);
        var del = await fileService.deleteFile(s3, doc);
        if (del) {
            logger.info("/delete user doc");
            res.status(200).send('')
        } else {
            res.status(404).send({
                message: 'error deleting'
            });
        }

    } else {
        res.status(404).send({
            message: 'No Doc found!'
        });
    }
}

async function getUserByUsername(username) {
    console.log('getUserByUsername')
    logger.info("inside getUserByUsername function");
    return User.findOne({
        where: {
            username: username
        }
    });
}

async function comparePasswords(existingPassword, currentPassword) {
    return bcrypt.compare(existingPassword, currentPassword);
}

module.exports = {

    updateUserDoc: updateUserDoc,
    getUserDoc: getUserDoc,
    getUserDocAll: getUserDocAll,
    deleteUserDoc: deleteUserDoc,

};