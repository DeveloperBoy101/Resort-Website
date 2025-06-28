const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../middlewhere.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});
// index route and creating a new listing
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Fetch all listings
  .post(
    isloggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

  //New Route
router.get("/new", isloggedIn, listingController.renderNewForm);

// updating, and deleting a listing by ID
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show details of a specific listing
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.updateListing)
  ) // Update a listing
  .delete(isloggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete a listing

//edit form for listing
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
