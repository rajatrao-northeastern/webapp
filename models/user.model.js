module.exports = (sequelize, Sequelize) => {
     const User = sequelize.define("users",
     {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: 'true'
        },
        FirstName:  {
            type: Sequelize.STRING,
        }, 
        LastName:  {
            type: Sequelize.STRING
        },
        Email:  {
            type:Sequelize.STRING
        },
        Password:  {
            type:Sequelize.STRING
        },
     });

     return User;
};