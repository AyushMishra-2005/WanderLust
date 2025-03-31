const express = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//creating review
module.exports.createReview = async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Crated!");
  res.redirect(`/listings/${id}`);
};


//deleting review
module.exports.deleteReview = async (req, res) => {
  let {id : listing_id, review_id} = req.params;
  await Listing.findByIdAndUpdate(listing_id, {$pull : {reviews : review_id}});
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${listing_id}`);
};



























