const mongoose = require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      default:[0,0]
    }
  },
  category: {
  type: String,
  enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"],
  default: "Trending"
}

});

// listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
  await Review.deleteMany({_id:{$in: listing.reviews}});
}
});
//Even though you don’t directly call or reference the middleware in app.js, it works
//  because you import the model, and the model carries the schema and its
//  middleware with it.

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
