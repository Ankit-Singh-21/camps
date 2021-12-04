const joi=require('Joi');



module.exports.reviewSchema=joi.object({
    review:joi.object({
        body:joi.string().required(),
        rating:joi.number().required().min(1).max(5)
    }).required()
})