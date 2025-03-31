const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1565025968207-cf3123cd1e8a?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) => (!v ? "https://images.unsplash.com/photo-1565025968207-cf3123cd1e8a?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v),
    }
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review",
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry: {
    type: {
      type: String, 
      enum: ['Point', 'administrative'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }, 
  category : {
    type : String,
    enum : ["Rooms", "Iconic Cities", "Mountain", "Castle","Amazing Pools", "Camping", "Farms", "Hill Station","Arctic", "Boats"],
  },
});


// delete middleware for reviews when delete listing is called
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing.reviews.length){
    let result = await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;





















