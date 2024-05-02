const express = require("express");
const app = express();
const client = require("mongodb").MongoClient;
const cookieparser = require("cookie-parser")
const session = require("express-session");
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs")

let dbinstance;
client.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((res) => {
        console.log("Mongodb connected");
        dbinstance = res.db("authentication");
    })
    .catch((err) => {
        console.log(err);
    })

const oneday = 24 * 60 * 60 * 100;
app.use(cookieparser());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: "2effv.....__kfr",
    cookie: { maxAge: oneday }
}));

app.post("/signupdata", (req, res) => {
    const { email, password } = req.body;

    const obj = {};
    obj.email = email;
    obj.password = password;
    dbinstance.collection("data").insertOne(obj)
        .then((result) => {
            console.log("data stored successfully");
            res.end();
        })
        .catch((err) => {
            console.log(err);
        })
})
app.post("/logindata", (req, res) => {
    const { email, password } = req.body;

    dbinstance.collection("data").findOne({ $and: [{ "email": email }, { "password": password }] })
        .then((result) => {
            if (result === null) {
                res.send("Invalid email/password");
            } else {
                req.session.email = email;
                res.render("home", { "email": email });
            }
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get("/", (req, res) => {
    if (req.session.email) {
        res.render("home", { "email": req.session.email });
    } else {
        res.redirect("/login.html");
    }
})

app.get("/login.html", (req, res) => {
    res.sendFile(__dirname + "/login.html");
})

app.get("/signup.html", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.listen(3000, (err) => {
    if (err) {
        console.log("Server can't activate");
    } else {
        console.log("server activated");    
    }
})