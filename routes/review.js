const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Ratings
router.post("/",
	isLoggedIn,
	validateReview,
	wrapAsync(reviewController.createReview),
);

//delete ratings
router.delete(
	"/:review_id",
	isReviewAuthor, 
	wrapAsync(reviewController.deleteReview),
);


module.exports = router;
