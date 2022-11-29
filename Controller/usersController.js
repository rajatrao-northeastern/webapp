const db = require('../config/sequelizeDB.js');
const User = db.users;
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');

const logger = require("../config/logger");
const SDC = require('statsd-client');
const dbConfig = require('../config/configDB.js');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});


const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1'
});
var sns = new AWS.SNS({});
var dynamoDatabase = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION || 'us-east-1'
});

// Create a User

async function createUser (req, res, next) {
    logger.info("inside createUSer function");
   const salt = bcrypt.genSaltSync(10);
    var hash = await bcrypt.hash(req.body.password, salt);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!emailRegex.test(req.body.username)) {
        logger.info("/create user 400");
        res.status(400).send({
            message: 'Enter your Email ID in correct format. Example: abc@xyz.com'
        });
    }
    logger.info("before findOne function");
    const getUser = await User .findOne({where: {username: req.body.username}}).catch(err => {
        logger.error("/create user error 500");
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the user'
        });
    });


    if(getUser) {

        console.log('verified and existing', getUser.dataValues.isVerified);
        var msg = getUser.dataValues.isVerified ? 'User already exists! & verified' : 'User already exists! & not verified';
        console.log('verified and existing msg' ,msg);

        logger.error("User already exists!");
        res.status(400).send({
            message: msg
        });
    } else {
        var user = {
            id: uuidv4(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hash,
            username: req.body.username,
            isVerified: false
        };
    logger.info("before User.create");
    User.create(user).then(async udata => {
        logger.info("inside create user 201");
        sdc.increment('endpoint.createuser');

        const randomnanoID = uuidv4();
        const expiryTime = new Date().getTime();
        var parameter = {
            TableName: 'csye6225',
            Item: {
                'Email': {
                    S: udata.username
                },
                'TokenName': {
                    S: randomnanoID
                },
                'TimeToLive': {
                    N: expiryTime.toString()
                }
            }
        };
        logger.info("parameter variable created");

        try {
            var dydb = await dynamoDatabase.putItem(parameter).promise();
            console.log('try dynamoDatabase', dydb);
        } catch (err) {
            console.log('err dynamoDatabase', err);
        }

        console.log('dynamoDatabase', dydb);
                var msg = {
                    'username': udata.username,
                    'token': randomnanoID
                };
                console.log(JSON.stringify(msg));

        const params = {

            Message: JSON.stringify(msg),
            Subject: randomnanoID,
            TopicArn: 'arn:aws:sns:us-east-1:838931846632:verify_email'
        }

        var publishTextPromise = await sns.publish(params).promise();

        console.error('publishTextPromise', publishTextPromise);

        res.status(201).send({
            id: udata.id,
            first_name: udata.first_name,
            last_name: udata.last_name,
            username: udata.username,
            account_created: udata.createdAt,
            account_updated: udata.updatedAt,
            isVerified: udata.isVerified
        });
    })
    .catch(err => {
        logger.error(" Error while creating the user! 500");
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user!"
        });
    });
    }
}

// Verify user
async function verifyUser(req, res, next) {
    console.log('verifyUser :');
    logger.info("inside verifyUser function");
    console.log('verifyUser :', req.query.email);
    const user = await getUserByUsername(req.query.email);
    logger.info("after getUserByUsername function");
    if (user) {
        console.log('got user  :');
        if (user.dataValues.isVerified) {
            res.status(202).send({
                message: 'Already Successfully Verified!'
            });
        } else {

            var params = {
                TableName: 'csye6225',
                Key: {
                    'Email': {
                        S: req.query.email
                    },
                    'TokenName': {
                        S: req.query.token
                    }
                }
            };
            console.log('got user  param:');
            // Call DynamoDB to read the item from the table

            dynamoDatabase.getItem(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    res.status(400).send({
                        message: 'unable to verify'
                    });
                } else {
                    console.log("Success dynamoDatabase getItem", data.Item);
                    try {
                        var ttl = data.Item.TimeToLive.N;
                        var curr = new Date().getTime();
                        console.log(ttl);
                        console.log('time diffrence', curr - ttl);
                        var time = (curr - ttl) / 60000;
                        console.log('time diffrence ', time);
                        if (time < 5) {
                            if (data.Item.Email.S == user.dataValues.username) {
                                User.update({
                                    isVerified: true,
                                }, {
                                    where: {
                                        username: req.query.email
                                    }
                                }).then((result) => {
                                    if (result == 1) {
                                        logger.info("update user 204");
                                        sdc.increment('endpoint.userUpdate');
                                        res.status(200).send({
                                            message: 'Successfully Verified!'
                                        });
                                    } else {
                                        res.status(400).send({
                                            message: 'unable to verify'
                                        });
                                    }
                                }).catch(err => {
                                    res.status(500).send({
                                        message: 'Error Updating the user'
                                    });
                                });
                            } else {
                                res.status(400).send({
                                    message: 'Token and email did not matched'
                                });
                            }
                        } else {
                            res.status(400).send({
                                message: 'token Expired! Cannot verify Email'
                            });
                        }
                    } catch (err) {
                        console.log("Error", err);
                        res.status(400).send({
                            message: 'unable to verify'
                        });
                    }
                }
            });

        }
    } else {
        res.status(400).send({
            message: 'User not found!'
        });
    }
}

//Get a User

async function getUser(req, res, next) {
    let id = req.params.id
    logger.info("inside getUser function");
    const user = await getUserByUsernameID(req.user.username, id);
    logger.info("after getUserByUsernameID function");
    if (user) {
        logger.info("get user 200");
        res.status(200).send({
            id: user.dataValues.id,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            username: user.dataValues.username,
            account_created: user.dataValues.createdAt,
            account_updated: user.dataValues.updatedAt,
            isVerified: user.dataValues.isVerified
        });
    } else {
        res.status(400).send({
            message: 'User not found!'
        });
    }
}

// Update a user

async function updateUser(req, res, next) {
    let id = req.params.id
    logger.info("inside updateUser function");
    if(req.body.username != req.user.username) {
        res.status(400);
    }
    if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password) {
        res.status(400).send({
            message: 'Enter all parameters!'
        });
    }
    logger.info("before User.update");
    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: await bcrypt.hash(req.body.password, 10)
    }, {where : {username: req.user.username, id: id}}).then((result) => {
        if (result == 1) {
            logger.info("update user 204");
            sdc.increment('endpoint.userUpdate');
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }   
    }).catch(err => {
        res.status(500).send({
            message:err.message || 'Error Updating the user'
        });
    });
}

async function getUserByUsername(username) {
    logger.info("inside getUserByUsername function");
    return User.findOne({where : {username: username}});
}

async function getUserByUsernameID(username, id) {
    logger.info("inside getUserByUsernameID function");
    return User.findOne({where : {username: username, id: id}});
}

async function comparePasswords (existingPassword, currentPassword) {
    logger.info("inside comparePasswords function");
    return bcrypt.compare(existingPassword, currentPassword);
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    getUserByUsername: getUserByUsername,
    comparePasswords: comparePasswords,
    updateUser: updateUser,
    verifyUser: verifyUser
};