const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");


//Connecting database
mongoose.connect("mongodb://localhost/auth_demo");

var publicDir = require('path').join(__dirname,'/image'); 
app.use(express.static(publicDir));

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}))

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/user",isLoggedIn ,(req,res) =>{
    try{
        res.render("user");
    }catch(e){
        console.log('Please log in')
    }
})
//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/user",
    failureRedirect:"/login"
}),function (req, res){

})

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

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

app.get('/jobs',(req,res)=>{
    res.json({
        "Front end Developer":2,
        "Back-end Developer":10,
        "Full Stack Developer": 5
    })
})
app.get('/meme',(req,res)=>{
    res.render('meme')
})
app.post('/meme',(req,res)=>{
    const memeString=req.body.meme
    if(memeString==='secret'){
        //console.log('true')
        res.render('image')
    }else{
        res.render('meme')
    }
})

app.get('/intro',isLoggedIn,(req,res)=>{
    // const user=new User(req.body)
    // // const username=user.username
    // console.log(user)
    res.json({
        "First Name":req.user.fname,
        "Second Name":req.user.lname,
        "Username":req.user.username,

    })
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    //res.render('Please authenticate')
    res.redirect("/login");
} 

app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
})