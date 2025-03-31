const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const Listing = require("../models/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");


//To add listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Edit Route
router.get("/:id/edit", 
	isLoggedIn, 
	isOwner, 
	wrapAsync(listingController.renderEditForm),
);


// common routers for /listings
router.route("/")
	//To show all the titles of the listing
	.get(wrapAsync(listingController.index))

	//creating new listing
	.post(
		isLoggedIn,
		upload.single('listing[image]'),
		validateListing,
		wrapAsync(listingController.createNewListing),
	);

router.route("/saveCategory")
	.get(
		wrapAsync(listingController.saveCategory),
	);


router.route("/search")
	.get(
		wrapAsync(listingController.searchDestination),
	);


// Commpn routers for /listings/:id
router.route("/:id")
	//To show the details of the each title
	.get(
		wrapAsync(listingController.showListings)
	)

	//Update Route
	.put(
		isLoggedIn, 
		isOwner, 
		upload.single('listing[image]'),
		validateListing, 
		wrapAsync(listingController.updateListing),
	)

	// Delete Route
	.delete(
		isLoggedIn,
		isOwner,
		wrapAsync(listingController.deleteListing),
	);


module.exports = router;





















