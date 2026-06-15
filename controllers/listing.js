
const Listing = require("../models/listing");




//Index Route
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

//New Route
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}

//Show Route
module.exports.showListing = async (req,res) => {
    const listing = await Listing.findById(req.params.id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    res.render("listings/show.ejs", {listing});
}  

//Create Route
module.exports.createListing = async (req,res) => {
    const newListing = new Listing(req.body.listing);
    newListing.image = {url: req.file.path, filename: req.file.filename};
    newListing.owner = req.user._id;
    await newListing.save();    
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
}

//Edit Route
module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250,h_250");
    res.render("listings/edit.ejs", {listing, originalImage});
}

//Update Route
module.exports.updateListing = async (req,res) => {
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }
    await listing.save();
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
}

//Delete 
module.exports.deleteListing = async (req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
}

