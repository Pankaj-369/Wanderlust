const Listing = require("../models/listing");


module.exports.index=async (req, res) => {
  let category=req.query.category;
  let searchitem=req.query.q;
  let allListings;
  
  
  if(category){
     allListings = await Listing.find({category});
  }
  else{
     allListings= await Listing.find({})
  }

  if(searchitem){
    allListings= await Listing.find({title:searchitem});
  }
    res.render('listings/index.ejs', { Listings:allListings,category});

}

module.exports.searchListings=async (req, res) => {
    const query=req.query.q;
    const Listings= await Listing.find({title:query});
    console.log(Listings);
    res.render('listings/dum.ejs', { Listings:Listings});
}

module.exports.renderNewForm=async (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing=async(req,res)=>{
    const id=req.params.id;
    const listing= await Listing.findById(id)
    .populate({
        path:"reviews", 
        populate:{
             path:"author",
        }  
    })
    .populate("owner");

      if (listing.geometry.coordinates[0]===0 && listing.geometry.coordinates[1]===0) {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listing.location)}`);
      const data = await geoRes.json();
 
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        listing.geometry = {
          type: "Point",
          coordinates: [lng, lat]
        };
        await listing.save();
        console.dir(`✅ Geocoded & saved: ${listing.title}`);
      } else {
        console.warn(`❌ No geo result for: ${listing.location}`);
      }
    } catch (err) {
      console.error("❌ Geocoding failed:", err.message);
    }
  }

    
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing:listing });
}

module.exports.createListing=async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    let query=req.body.listing.location;
let lon;
let lat;
 const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
const data = await response.json();

if (data.length > 0) {
  lat = parseFloat(data[0].lat);
  lon = parseFloat(data[0].lon);
} else {
  req.flash("error", "Could not locate the given address.");
  return res.redirect("/listings/new");
}
        
        const coordinates= {
            type:"Point",
            coordinates:[
                lon,
                lat
            ],
          };

    const newlisting =new Listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=coordinates;
    let result=await newlisting.save();
    console.log(result);
    req.flash("success","New Listing Created");
    res.redirect('/listings');
}

module.exports.renderEditForm=async(req,res)=>{
    const id=req.params.id;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    
    let originalImageUrl=listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render('listings/edit.ejs', { listing,originalImageUrl });
    
}

module.exports.updateListing= async(req,res)=>{

     if(!req.body){
        throw new ExpressError(400,"Send valid data for listing");
    }
   const id=req.params.id;
   const updatedListing=await Listing.findByIdAndUpdate(id,req.body.listing,{
   new: true,
   runValidators: true,
   runSettersOnQuery: true
});
if(typeof req.file!== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    updatedListing.image={url,filename};
    await updatedListing.save();
}
    console.log('Listing updated:', updatedListing);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing= async(req,res)=>{
    console.log('Delete request received', req.params.id);
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
}