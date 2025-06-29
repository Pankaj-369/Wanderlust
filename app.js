if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session= require("express-session");
const MongoStore= require("connect-mongo");

const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const flash=require("connect-flash");  // to flash message on time 
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl= process.env.ATLASDB_URL;

main().then(()=>{
    console.log('Connected to MongoDB');
})

async function main(){
    await mongoose.connect(dbUrl);
}
app.use(methodoverride('_method'));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
const port = process.env.PORT || 4000 

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"user@gmail.com",
//         username:"fakeuser",
//     });

//    let registeredUser= await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
//     // this register method checks if the username is unique by itself
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get('/',(req,res)=>{
//     res.send('Hello World!');
// });




app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
});



app.listen(port, () => {
    console.log('Server is running on port 3000');
})




















// app.get('/listings', async (req, res) => {
    
//     const samplelisting =new Listing({
//         title: 'Sample Listing',
//         description: 'This is a sample listing description.',
//         price: 1000,
//         location: 'Sample Location',
//         country: 'Sample Country'
//     })
//     await samplelisting.save().then(()=>{
//         res.send('Sample Listing Added')
//         console.log('Sample Listing Added');
//     }).catch((err) => {
//         console.error('Error adding sample listing:', err);
// });

// });