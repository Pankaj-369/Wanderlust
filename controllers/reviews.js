const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview= async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let id=req.params.id;
    let newreview =new Review(req.body.review);
    newreview.author = req.user._id;

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    console.log("review added successfully");
    console.log(id);
    req.flash("success"," New Review Created");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview =async(req,res)=>{
    let {id,reviewid} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);

    req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
}