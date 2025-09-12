// import the framework to do our API
// using nodemon in package.json so the server refreshes everytime we have changes
import express from "express";

// initialize the express instance
const app = express();

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(5001, ()=> {
    console.log("Server is running on port 5001")
})
