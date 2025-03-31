const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string(),
      url: Joi.string().uri().allow("", null),
    }).optional(),
    geometry: Joi.object({
      type: Joi.string(),
      coordinates: Joi.array().items(Joi.number()).min(2),
    }).optional(),
    category: Joi.string()
    .valid("Rooms", "Iconic Cities", "Mountain", "Castle", "Amazing Pools", "Camping", "Farms", "Hill Station", "Arctic", "Boats")
    .required(),
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review : Joi.object({
    rating : Joi.number().required().min(1).max(5),
    comment : Joi.string().required(),
  }).required(),
});




















