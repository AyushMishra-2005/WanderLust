const Listing = require("./models/listing.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path);
  // console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    //redirectUrl 
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let prevlisting = await Listing.findById(id);
  if (!prevlisting.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have the permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


// middleware for validation of the schema server side for listing
module.exports.validateListing = (req, res, next) => {
	let result = listingSchema.validate(req.body);
	if (result.error) {
		let errMessage = result.error.details.map((el) => el.message).join(",");
		console.log(result.error.details);
		throw new ExpressErrors(400, errMessage);
	} 
	next();
};


// for validation of the schema server side for review
module.exports.validateReview = (req, res, next) => {
	let result = reviewSchema.validate(req.body);
	if(result.error){
		let errMessage = result.error.details.map((el) => el.message).join(",");
		console.log(result.error.details);
		throw new ExpressErrors(400, errMessage);
	}
	next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let {id : listing_id, review_id } = req.params;
  let review = await Review.findById(review_id);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have the permission!");
    return res.redirect(`/listings/${listing_id}`);
  }
  next();
}


module.exports.getCoordinates = async (city, country) => {
  try {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${city},${country}&format=json&limit=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    if (data.length > 0) {
      const lon = data[0].lon;
      const lat = data[0].lat;
      const type = data[0].type;
      return {lon , lat,  type};
    } else {
      return {};
    }
  } catch (error) {
    console.error("Location Not Found!");
    return {};
  }
}




