require('dotenv').config();
var express = require('express');
const cors = require("cors");
var bodyParser = require('body-parser');

var app = express()

const db = require('./models');

app.use(bodyParser.urlencoded({extended: true}))

var corsOptions = {
    origin: "http://localhost:3000"
  };
  
  app.use(cors(corsOptions));

  app.use(bodyParser.json());

  db.sequelize.sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });

    
//Authentication
// app.use (( req, res ,next ) => {
//     if ( !req.get ( 'Authorization' ) ) {
//         var err = new Error('Not Authenticated')
//         res.status(401).set('WWW-Authenticate', 'Basic')
//         next(err)
//    }
//     else { 
//         var credentials = Buffer.from(req.get('Authorization').split(' ')[1],'base64')
//         .toString()
//         .split(':')
//         var username = credentials [ 0 ]
//         var password = credentials [ 1 ]
//         if ( !( username ===  process.env.UNAME && password === process.env.PASS) ) {
//             var err = new Error ('Not Authenticated!')
//             res.status(401).set ('WWW-Authenticate','Basic')
//             next(err)
//         }
//         res.status(200)
//         next()
//     }
// });

app.get("/", (req, res) => {
    res.json({ message: "Route is Authenticated" });
  });

  require("./api/users/user.router")(app);

app.get("/", (req,res) => {
    res.send('Protected route with Basic HTTP Authentication')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});