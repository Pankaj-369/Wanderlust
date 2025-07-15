const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {isLoggedIn}=require("../middleware.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

// POST /become-host

router.get("/hostform", isLoggedIn, (req, res) => {
  if (req.user.isHost) {
    req.flash("info", "You are already a host!");
    return res.redirect("/hosting");
  }
  res.render("hosting/hostForm");
});

router.get("/mylistings", isLoggedIn, async (req, res) => {
  const Listings = await Listing.find({ owner: req.user._id });
  res.render("hosting/mylistings", { Listings });
});

router.post("/hostform",isLoggedIn, async (req, res) => {
  const { phone, experience, idType, idNumber, bio } = req.body;

  try {
    const userId = req.user._id;

    // Update current user to become host
    await User.findByIdAndUpdate(userId, {
      isHost: true,
      phone,
      experience,
      idType,
      idNumber,
      bio,
    });

    req.flash("success", "You are now a host!");
    res.redirect("/hosting"); 
  } catch (err) {
    console.error("Error updating user to host:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/hostform");
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  const bookings = await Booking.find({ listing: { $in: listings.map(l => l._id) } })
    .populate("user listing").populate("listing");;
  res.render("hosting/OwnerDashboard", { bookings });
});

router.get("/mylistings/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/hosting");
    }

    // Ensure the logged-in user is the owner (host)
    if (!listing.owner._id.equals(req.user._id)) {
      req.flash("error", "Unauthorized access to listing.");
      return res.redirect("/hosting");
    }

    // Geocode if coordinates are missing (0, 0)
    if (
      listing.geometry.coordinates[0] === 0 &&
      listing.geometry.coordinates[1] === 0
    ) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            listing.location
          )}`,
          {
            headers: {
              "User-Agent": "wanderlust-app/1.0 (pankaj.kandpal24@gmail.com)",
              Accept: "application/json",
            },
          }
        );

        const data = await geoRes.json();
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          listing.geometry = {
            type: "Point",
            coordinates: [lng, lat],
          };
          await listing.save();
          console.log(`✅ Geocoded & saved: ${listing.title}`);
        } else {
          console.warn(`❌ No geo result for: ${listing.location}`);
        }
      } catch (err) {
        console.error("❌ Geocoding failed:", err.message);
      }
    }

    res.render("listings/show", { listing, isHostRoute: true });
  } catch (err) {
    console.error("❌ Error loading listing:", err.message);
    req.flash("error", "Something went wrong.");
    res.redirect("/hosting");
  }
});




module.exports = router;