const mongoose = require("mongoose");
// const { string } = require("joi");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// listingSchema.post("findOneAndDelete",async(listing)=>{
// if(listing){
//   await Review.deleteMany({_id:{$in: listing.reviews}});
// }
// });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
