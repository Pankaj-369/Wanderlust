const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//reviews

router.post('',
    isLoggedIn,
    validateReview ,
    wrapAsync(reviewController.createReview));

router.delete("/:reviewid",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports=router;