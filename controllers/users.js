const User = require("../models/user.js");


//Signup
module.exports.renderSignup = (req,res) => {
    res.render("users/signup.ejs");
}

//Login
module.exports.renderLogin = (req,res) => {
    res.render("users/login.ejs");
}

//Signup
module.exports.signup = (async (req,res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");  
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
})

//Login
module.exports.login = (async (req,res) => {
    req.flash("success", "Welcome back to Wanderlust");
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);     
    delete res.locals.redirectUrl;
})

//Logout
module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
}
   