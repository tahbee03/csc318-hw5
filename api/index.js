require("dotenv").config();
const express = require("express"); // Server
const bp = require("body-parser"); // form (HTML) -> request (JS)
const mongoose = require("mongoose"); // Database
const app = express();

// START OF DB MODEL

const Person = mongoose.model("Person", new mongoose.Schema({
    name: String,
    quote: String
}));

// END OF DB MODEL

// START OF MIDDLEWARE

// Sets template engine to EJS
app.set("view engine", "ejs");

// Makes anything in the /public directory accessible to anyone
app.use(express.static("public"));

// Allows server to accept JSON
app.use(bp.json());

// Allows data to be extracted from forms and adds it to request body
app.use(bp.urlencoded({ extended: true }));

// END OF MIDDLEWARE 

// START OF ROUTES 

app.get("/", async (req, res) => {
    try {
        const data = await Person.find();
        res.render("index.ejs", { data });
    } catch (error) {
        console.log(error);
    }
});

app.post("/people", async (req, res) => {
    console.log(`POST: ${JSON.stringify(req.body)}`);
    try {
        await Person.create({name: req.body.name, quote: req.body.quote});
    } catch (error) {
        console.log(error);
    }
    res.redirect("/");
});

app.put("/people", async (req, res) => {
    console.log(`PUT: ${JSON.stringify(req.body)}`);
    try {
        await Person.findOneAndUpdate({ name: req.body.name }, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        });

        res.status(200).json({msg: "Success"});
    } catch (error) {
        console.log(error);
    }
});

app.delete("/people", async (req, res) => {
    console.log(`DELETE: ${JSON.stringify(req.body)}`);
    try {
        await Person.deleteOne({ _id: req.body._id });

        res.status(200).json({msg: "Success"});
    } catch (error) {
        console.log(error);
    }
});

// END OF ROUTES

// DB CONNECTION AND SERVER 
try {
    const run = async () => {
        await mongoose.connect(process.env.DB_URL);

        console.log("Successfully connected to the database.");

        if(process.env.PORT) {
            app.listen(process.env.PORT, () => {
                console.log(`Listening on port ${process.env.PORT}.`);
            });
        }

        module.exports = app;
    };

    run();
} catch(error) {
    console.log(error);
}