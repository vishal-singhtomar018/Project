const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require ("./models/listing.js");
const path = require("path");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to DB");
}).catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));

app.get("/", (req,res)=>{
    res.send("hi, I am root");
});

//index route
app.get("/listing", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;

    console.log("ID:", id);
    console.log("Type of ID:", typeof id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID");
    }

    try {
        const listing = await Listing.findOne({ _id: mongoose.Types.ObjectId(id) });

        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).send("Server Error");
    }
});
// app.get("/listings/:id", async (req, res) =>{
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", { listing });
// });


// app.get("/testListing", async (req,res) =>{
//     let samplelisting = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location: "Calanguate, Goa",
//         country: "India"
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.listen(8080, ()=> {
    console.log("server is listening to port 8080");
});