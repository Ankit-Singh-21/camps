const express=require('express');
const user = require('../model/user');
const router=express.Router();
const User=require('../model/user')
const wrapAsync=require('../utility/catch')
const passport=require('passport')
router.get('/register',(req,res)=>{
    res.render('users/register');
})


router.post('/register',wrapAsync(async (req,res)=>{
    try{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const regi=await User.register(user,password);
    console.log(regi)
    req.flash('success',"welcome to yelpcamp")
    res.redirect('/campgrounds');}
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register');
    }
}))

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success',"logged out");
})

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    // const redirectUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    res.redirect('/register');
})



module.exports=router;