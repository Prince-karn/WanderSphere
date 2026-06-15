const Listing = require("./models/listing");  
const Review = require("./models/review");
const {listingSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const {reviewSchema} = require("./schema");

  // Check if the user is logged in
  module.exports.isLoggedIn = (req,res,next) => {
 
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in to create a listing!");
            return res.redirect("/login");
        }
        next();
    }


    // Save the redirect url
    module.exports.saveRedirectUrl = (req, res, next) => {
        if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    }

    // Check if the user is the owner of the listing
    module.exports.isOwner = async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing.owner.equals(req.user._id)){
            req.flash("error", "You do not have permission to do that!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }

    //validate listing
    module.exports.validateListing = (req, res, next)=> {
        let {error} = listingSchema.validate(req.body);       
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,error)
    }else{
        next();
    };
};

//validate review
module.exports.validateReview = (req, res, next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    };
};


//check if the user is the author of the review
module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
    
