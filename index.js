const express = require('express')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const port= 9000;

const cloths = [
    { type: "Polo", brand: "Armani Exchange"},
    { type: "Shirts", brand: "GAS"},
    { type: "Jeans", brand: "G-Start Raw"}
]

app.get("/", (req,res) => {
    res.json(cloths)
});

app.get("/cloths/:id", (req,res) => {
    res.json(cloths[parseInt(req.params.id) -1])
});

app.post("/cloths", (req,res) => {
    console.log(req.body)
    res.json({message: "OK"})
});

app.put("/cloths/:id", (req,res) => {
    console.log(req.params.id)
    console.log(req.body)
    res.json({ message : `Updating Item: ${req.params.id}`})
});

app.delete("/cloths/:id", (req,res) => {
    console.log(req.param.id)
    res.json({ message: `Deleting Item: ${req.params.id}`})
});

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
    console.log("Here I am")
});