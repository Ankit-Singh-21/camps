const express=require('express');
const router=express.Router();
const Campground = require('../model/camp');
const Review=require('../model/review');
const AppError=require('../utility/appErr')
const wrapAsync=require('../utility/catch');
const joi=require('joi')
const reviewSchema=require('../Joischema.js');



const isLogged=function (req, res, next){
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}




router.post('/:id/reviews',isLogged,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const pro=await Campground.findById(id);
    const review=new Review(req.body.review);
    pro.reviews.push(review);
    await review.save();
    await pro.save();
    req.flash('success',"succesfully created new review");
    res.redirect(`/campgrounds/${id}`);
    }))

router.delete('/:campId/reviews/:reviewId',isLogged,wrapAsync(async (req,res)=>{
        const { campId, reviewId } = req.params;
        await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success',"Succesfully deleted")
        res.redirect(`/campgrounds/${campId}`);
    }))




router.get('*',wrapAsync((req,res,next)=>{
        throw new AppError("Page not found",505);
        }))
        
        module.exports=router;