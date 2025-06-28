const Listing = require("./Models/Listing");
const Review = require("./Models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
module.exports.isloggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listings...");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
}

module.exports.isOwner = async (req,res,next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// Validation Middleware
module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Invalid Listing Data"));
  }
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

// Validate Review Middleware
module.exports.validateReview = (req, res, next) => {
  console.log("Request Body:", req.body); // Debugging line

  if (!req.body.review) {
      return next(new ExpressError(400, "Invalid Review Data - 'review' object is missing"));
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      return next(new ExpressError(400, errMsg));
  }
  next();
};
module.exports.isReviewAuthor = async (req,res,next) => {
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "Your are not the author of this listing...!");
    return res.redirect(`/listings/${id}`);
  }
}
// console.log(req.path,"..",req.originalUrl);