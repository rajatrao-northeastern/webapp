const db = require("../../models");
const User = db.users;
// const bcrypt = require ("bcrypt");
// const { genSaltSync, hashSync } = require("bcrypt");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.Email) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    
    // Create a User
  const user = {
    id: req.body.id,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email ? req.body.Email : false,
    Password: req.body.password ? req.body.password : false,
  };

  User.create(user)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the User."
    });
  });
};

exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;
  
    User.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };

  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

  exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };

  exports.deleteAll = (req, res) => {
        User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} User were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

 exports.findAllUser = (req, res) => {
    User.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };



// module.exports = {
//         createUser: (req,res) => {
//             const body = req.body;
//             const salt =  bcrypt.genSaltSync(10);
//        //     console.log(salt);
//             body.Password = bcrypt.hashSync(body.Password, salt);
//             create(body, (err, results) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({
//                         success:0,
//                         message: "DB connection err!!"
//                     });
//                 }
//                 return res.status(200).json({
//                     success:1,
//                     data:results    
//                 });
//             });
//         },

//         getUser: (req, res) => {
//             getUser((err, results) => {
//                 if(err) {
//                     console.log(err);
//                     return;
//                 }
//                 return res.json({
//                     success:1,
//                     data:results
//                 });

//             });
//         },

//         getUserByUserID: (req,res) => {
//             const id = req.params.id;
//             getUserByUserID(id, (err, results) => {
//                 if(err) {
//                     console.log(err);
//                     return;
//                 }
//                 if(!results) {
//                     return res.json({
//                         success: 0,
//                         message: "Record not found"
//                     });
//                 }
//                 return res.json({
//                         success: 1,
//                         data: results
//                 });
//             });    
//         },     

//         updateUser: (req,res) => {
//             const body = req.body;
//             const salt = genSaltSync(10);
//             body.Password = hashSync(body.Password, salt);
//             updateUser(body,(err,results) => {
//                 if (err) {
//                     console.log(err);
//                     return;
//                 }
//                 if(!results){
//                     return res.json({
//                         success: 0,
//                         message: "Failed to Update"
//                     })
//                 }
//                 return res.json({
//                     success: 1,
//                     message: "Updated successfully"
//                 });
//             });
//         },

//         deleteUser: (req, res) => {
//             const data = req.body;
//             deleteUser(data, (err, results) => {
//                 if(err) {
//                     console.log(err);
//                     return;
//                 }
//                 if (!results) {
//                     return res.json({
//                         Success: 0,
//                         message: "Record Not Found"
//                     });
//                 }
//                 return res.json({
//                     Success: 1,
//                     Message:"User deleted Successfully"
//                 });
//             });
//         }
//  };
