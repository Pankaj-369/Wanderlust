const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    comment:String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports=mongoose.model("Review",ReviewSchema);