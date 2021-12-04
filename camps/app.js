const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./model/camp');
const Review=require('./model/review');
const ejsMate=require('ejs-mate')
const AppError=require('./utility/appErr')
const wrapAsync=require('./utility/catch');
const joi=require('joi')
const session=require('express-session');
const reviewSchema=require('./Joischema.js');
const { findByIdAndDelete, findById } = require('./model/review');
const campgrounds=require('./routes/campground')
const reviews=require('./routes/review')
const flash=require('express-flash');
const passport=require('passport')
const LocalStatergy=require('passport-local'); 
const User=require('./model/user');
const users=require('./routes/user')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify:false
}); 



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); 
  


const app = express();
const sessionConfig={
    secret:'thisisanactualsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}



app.use(flash());
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStatergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
    
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) =>{
    req.sessi
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds',campgrounds)
app.use('/campgrounds',reviews)
app.use('/',users)
app.use((err,req,res,next)=>{ 
    const {status=409}=err;
    if(!err.message){
        err.message="ohh its an error buddy";
    }
    res.status(status).render('errors',{err});
})


app.listen(3000,()=>{
    console.log("listening at 3000");
})