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






router.get('/',wrapAsync(async (req,res)=>{
    const pro=await Campground.find({});
    res.render('campi',{pro});
}))
  
router.get('/new',isLogged,(req,res)=>{
    res.render('new');
})



router.get('/:id',isLogged,wrapAsync(async (req,res)=>{
const {id}=req.params;
const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
}).populate('author');
res.render('show',{campground});
}))



router.post('/',isLogged,wrapAsync(async (req,res)=>{
    // res.send(req.body)
    const pro=req.body;
    // if(!req.body.price) throw new AppError("invalid data",502)
    // const campgroundSchema=joi.object({
    //      campground:joi.object({
    //         location:joi.string().required()
    //      }).required()
    // })

    // const {result}=campgroundSchema.validate({location})

    // if(result){
    //     const msg=result.error.details.map(el=>el.message).join(',');
    //     throw new AppError(msg,501);
    // }
    // console.log(result)
   let newa=new Campground(pro);
    await newa.save();
    req.flash('success',"succesfully created new campground");
    res.redirect(`/campgrounds/${newa._id}`); 
}))



router.get('/:id/edit',isLogged,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    let pro=await Campground.findById(id);
    if(!pro){
    req.flash("error","campground did not exist");
    res.redirect('/campgrounds')
    }
    if(pro._id.equals(us))
    res.render('edit',{pro});
}))

router.put('/:id',isLogged,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    let up=await Campground.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})
    req.flash('success',"Succesfully updated")
    res.redirect(`/campgrounds/${up._id}`)
}))

router.delete('/:id',isLogged,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Succesfully deleted")

    res.redirect('/campgrounds');
}))



// router.use((err,req,res,next)=>{
//     console.log(err.name)
//     next(err);
// })  



router.get('*',isLogged,wrapAsync((req,res,next)=>{
throw new AppError("Page not found",505);
}))

module.exports=router;