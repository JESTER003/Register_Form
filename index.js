const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express()
dotenv.config()
const port = process.env.PORT || 3000

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.9utbq.mongodb.net/RegistrationDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// New Schema --------------------------------------------------
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

// New Model --------------------------------------------------
const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.get("/", (req, res) => {
    // res.send("<h1>Hello</h1>")
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;


        const existingUser = await Registration.findOne({ email: email });              // name:name,password:password
        // checks for existing user 
        if (!existingUser) {
            const registraionData = new Registration({
                name,
                email,
                password
            });
            await registraionData.save();
            res.redirect("/success")
        }
        else {
            alert("User Already Registered.")
            res.sendFile(__dirname + "/pages/error.html")
        }
    } catch (e) {
        console.log(e);
        res.redirect("/error")
    }

})

app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
})
app.get('/error', (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})
app.listen(port, () => {
    console.log(`Eample app listening on port ${port}`)
})