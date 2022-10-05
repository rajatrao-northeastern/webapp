require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser');
const app = express()

const userRouter = require("./api/users/user.router");

app.use(bodyParser.urlencoded({extended: false}))
//app.use(express.json());
app.use(bodyParser.json());

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