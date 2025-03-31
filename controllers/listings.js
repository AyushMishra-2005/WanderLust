const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");

const {getCoordinates} = require("../middleware.js");

//To show all the titles of the listing
module.exports.index = async (req, res) => {
	let allListing = await Listing.find();
	res.render("listings/index.ejs", { allListing});
};

//To render new form
module.exports.renderNewForm = (req, res) => {
	res.render("listings/new.ejs");
};


// show listings
module.exports.showListings = async (req, res) => {
	let { id } = req.params;
	let listElement = await Listing.findById(id)
		.populate({
			path : "reviews", 
			populate: {
				path : "author",
			}
		})
		.populate("owner");
	if(!listElement){
		req.flash("error", "Listing you requested for does not exist!");
		return res.redirect("/listings");
	}
	const lon = listElement.geometry.coordinates[0];
	const lat = listElement.geometry.coordinates[1];
	res.render("listings/show.ejs", { listElement, lat, lon });
};



//create listing
module.exports.createNewListing = async (req, res, next) => {
	let imageURL = req.file.path;
	let filename = req.file.filename;

  let listing = req.body.listing;
	const Location = await getCoordinates(listing.location, listing.country);
	console.log(Location);
	if(Location && Object.keys(Location).length > 0){
		listing.image = {
			filename: filename,
			url: imageURL,
		}

		let geometry = {
			type : Location.type,
			coordinates : [Location.lon, Location.lat],
		}
		listing["geometry"] = geometry;


		let newUser = new Listing(listing);
		newUser.owner = req.user._id;
	
		await newUser.save();
		req.flash("success", "New Lising Crated!");
		console.log(req.file);
		res.redirect('/listings');
	}else{
		req.flash("error", "Given Location Not Found!");
		res.redirect('/listings/new');
	}
}



//Render edit form
module.exports.renderEditForm = async (req, res) => {
	let { id } = req.params;
	let listElement = await Listing.findById(id);
	if(!listElement){
		req.flash("error", "Listing you requested for does not exist!");
		return res.redirect("/listings");
	}

	let originalImageUrl = listElement.image.url;
	originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_300,w_250");

	res.render("listings/edit.ejs", { listElement , originalImageUrl});
};



//Update listing
module.exports.updateListing = async (req, res) => {
	let listing = req.body.listing;
	if (!listing) {
		throw new ExpressErrors(400, "Send valid data for listing!");
	}
	
	let { id } = req.params;

	const Location = await getCoordinates(listing.location, listing.country);
	if(Location && Object.keys(Location).length > 0){
		
		let geometry = {
			type : Location.type,
			coordinates : [Location.lon, Location.lat],
		}
		listing["geometry"] = geometry;

		let currlisting = await Listing.findByIdAndUpdate(id, listing);
	
		if(typeof req.file !== "undefined"){
			let imageURL = req.file.path;
			let filename = req.file.filename;
	
			currlisting.image = {
				filename: filename,
				url: imageURL,
			}
			await currlisting.save();
		}
		
		req.flash("success", "Listing Updated!");
		res.redirect(`/listings/${id}`);
	}else{
		req.flash("error", "Location Not Found!");
		res.redirect(`/listings/${id}/edit`);
	}
	
};



//delete listing 
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};



// Category
module.exports.saveCategory = async (req, res) => {
	let {category} = req.query;
	if(category === "Trending"){
		const allListing = await Listing.aggregate([
      {
        $addFields: { reviewCount: { $size: "$reviews" } } 
      },
      {
        $match: { reviewCount: { $gt: 2 } } 
      },
      {
        $sort: { reviewCount: -1 }
      }
    ]);
		res.render("listings/index.ejs", { allListing});
	}else{
		let allListing = await Listing.find({ category: category });
		res.render("listings/index.ejs", { allListing});
	}
};



// Search System
module.exports.searchDestination = async (req, res) => {
	const allListing = await Listing.find({
		location: { $regex: new RegExp(`^${req.query.searchDestinaton}`, "i") } } 
	);
	res.render("listings/index.ejs", { allListing });
};





