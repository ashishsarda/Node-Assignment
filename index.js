const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");


//Connecting database
mongoose.connect("mongodb://localhost/Assignment");//Database named Assignment

// var publicDir = require('path').join(__dirname,'/image'); 
// app.use(express.static(publicDir));

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false         //do not carry forward the prev sessions
}))

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(function(username, password, done) { //Using the Passport Local Strategy to authenticate Users
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }))
app.set("view engine","ejs");// Setting EJS as the default templating engine
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());
//Home Page
app.get("/", (req,res) =>{
    res.render("home");
})
//Display the currently logged in user if he is authenticated using a middleware.
app.get("/user",isLoggedIn ,(req,res) =>{
    try{
        res.render("user");
    }catch(e){
        console.log('Please log in')
    }
})
//Registering a new User
app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",(req,res)=>{
    
    User.register(new User({fname:req.body.fname,lname:req.body.lname,username: req.body.username,phone:req.body.phone,birth: req.body.birth}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})
//Directing to Logging in Users
app.get("/login",(req,res)=>{
    res.render("login");
})
//Authenticating the details provided and checking if it matches the database
//If it does user will be redirected to user page or login page
app.post("/login",passport.authenticate("local",{
    successRedirect:"/user",
    failureRedirect:"/login",
    failureFlash:true
}),function (req, res){

})


// .logout() is provided by the Passport module for easy logout which is attched to request
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

//Returns an array of json 
app.get('/jobs',(req,res)=>{
    res.json({
        "jobs":[
            {"Front End Developer":5},
            {"Back End Developer":10},
            {"Full Stack Deveoper":7}
        ]
    })
})
//To serve the meme page and receive an input
app.get('/meme',(req,res)=>{
    res.render('meme')
})
//To check if the input string which is attached to the body of the request satisfies a condition.
//If it does render image ejs file or the meme ejs file.
app.post('/meme',(req,res)=>{
    const memeString=req.body.meme
    if(memeString==='secret'){
        //console.log('true')
        res.render('image')
    }else{
        res.render('meme')
    }
})

//Serving the details of the user currently logged in using the isLoggedIn middleware to authenticate if the suer is logged in
app.get('/intro',isLoggedIn,(req,res)=>{
    res.json({
        "message":`string- Hey my name is ${req.user.fname} ${req.user.lname} and I'm a 3rd year student at VIT.`,
        "First Name":req.user.fname,
        "Second Name":req.user.lname,
        "Username":req.user.username,

    })
})
//Middleware function to authenticate if the suer is logged in. Will be used in different routers to authenticate.
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    //console.log('Please authenticate')
    res.redirect("/login");
} 
//creating a server locally on port 3000
app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
})