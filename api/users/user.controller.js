const { create, getUser, getUserByUserID, updateUser, deleteUser  } = require("./user.service");
const bcrypt = require ("bcrypt");
const { genSaltSync, hashSync } = require("bcrypt");

module.exports = {
        createUser: (req,res) => {
            const body = req.body;
            const salt =  bcrypt.genSaltSync(10);
       //     console.log(salt);
            body.Password = bcrypt.hashSync(body.Password, salt);
            create(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success:0,
                        message: "DB connection err!!"
                    });
                }
                return res.status(200).json({
                    success:1,
                    data:results    
                });
            })
        },

        getUser: (req, res) => {
            getUser((err, results) => {
                if(err) {
                    console.log(err);
                    return;
                }
                return res.json({
                    success:1,
                    data:results
                });
            });
        },

        getUserByUserID: (req,res) => {
            const id = req.params.id;
            getUserByUserID(id, (err, results) => {
                if(err) {
                    console.log(err);
                    return;
                }
                if(!results) {
                    return res.json({
                        success: 0,
                        message: "Record not found"
                    });
                }
                return res.json({
                        success: 1,
                        data: results
                });
            });    
        },     

        updateUser: (req,res) => {
            const body = req.body;
            const salt = genSaltSync(10);
            body.Password = hashSync(body.Password, salt);
            updateUser(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                return res.json({
                    success: 1,
                    message: "Updated successfully"
                });
            });
        },

        deleteUser: (req, res) => {
            const data = req.body;
            deleteUser(data, (err, results) => {
                if(err) {
                    console.log(err);
                    return;
                }
                if (!results) {
                    return res.json({
                        Success: 0,
                        message: "Record Not Found"
                    });
                }
                return res.json({
                    success: 1,
                    message:"User deleted Successfully"
                });
            });
        }

    };
