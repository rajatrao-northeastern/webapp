require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express()
const userRouter = require("./api/users/user.router");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//Authentication
app.use (( req, res ,next ) => {
    // If ' Authorization ' header not present
    if ( !req.get ( 'Authorization' ) ) {
        var err = new Error('Not Authenticated')
        res.status(401).set('WWW-Authenticate', 'Basic')
        next(err)
   }
    // If ' Authorization ' header present
    else {
        // Decode the ' Authorization ' header Base64 value
        var credentials = Buffer.from(req.get('Authorization').split(' ')[1],'base64')
        // < Buffer 75 73 65 72 6e 61 6d 65 3a 70 61 73 73 77 6f 72 64 >
        .toString()
        // username : password
        .split(':')

        // [ username ' , ' password ' ]
        var username = credentials [ 0 ]
        var password = credentials [ 1 ]
        // If credentials are not valid
        if ( !( username ===  process.env.UNAME && password === process.env.PASS) ) {
            var err = new Error ('Not Authenticated!')
            // Set status code to ' 401 Unauthorized ' and ' WWW - Authenticate ' header to ' Basic '
            res.status(401).set ('WWW-Authenticate','Basic')
            next(err)
        }
        res.status(200)
        next()
    }
});

app.get("/", (req,res) => {
    res.send('Protected route with Basic HTTP Authentication')
});


app.get("/api", (req,res) =>{
    res.json({
        success:1,
        Message: "Rest Api is working"
    });
})

app.use("/api/user", userRouter);

app.listen(process.env.APP_PORT, ()=> {
    console.log(`Listening on port ${process.env.APP_PORT}`)
    console.log("Here I am")
});