const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js"); // adjust path if needed
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


const preventOwnerBooking = async (req, res, next) => {
  const { userId, listingId } = req.body;
  const listing = await Listing.findById(listingId);
  if (listing.owner.equals(userId)) {
    req.flash("error", "You cannot book your own listing.");
    return res.redirect(`/listings/${listingId}`);
  }
  next();
};



router.get("/bookings/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("bookings/bookingForm", { listing, currentUser: req.user });
  } catch (err) {
    console.error("Error fetching listing for booking:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

router.post("/bookings", isLoggedIn, preventOwnerBooking, async (req, res) => {
  const { userId, listingId, checkIn, checkOut, guests, totalPrice } = req.body;
  console.log(req.body);

  if (!userId || !listingId || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await Booking.create({
      user: userId,
      listing: listingId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: guests,
      totalPrice,
    });

    res.redirect("/my/bookings")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

router.get("/my/bookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/mybookings", { bookings });
});



router.delete("/bookings/:id", isLoggedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/my/bookings");
    }

    // Allow only the user who created the booking to cancel
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "Unauthorized");
      return res.redirect("/my/bookings");
    }

    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/my/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while cancelling");
    res.redirect("/my/bookings");
  }
});


module.exports = router;


