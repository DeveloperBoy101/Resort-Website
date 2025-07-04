const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    image: Joi.string().allow(""),
    price: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

module.exports = { listingSchema, reviewSchema }; // ✅ Fix
