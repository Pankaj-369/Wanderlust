const User = require("../models/user.js");
 
 module.exports.renderSignupForm=async(req,res)=>{
    res.render("users/signup.ejs");
}

 module.exports.signup=async(req,res,next)=>{
     try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser= await User.register(newUser,password);
        //User.register() hashes the password and saves user with username, salt, and hash,checks if user name is unique,
        console.log(registeredUser);
        
        // req.login() adds the user's _id to the session (triggers serializeUser).
        // Now the session cookie stores the user ID.
    
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })  
        } catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
}

module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login =async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}