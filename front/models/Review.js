import {model, models, Schema} from "mongoose";

const reviewSchema = new Schema({
  title: String,
  description: String,
  stars: Number,
  product: {type:Schema.Types.ObjectId},
}, {timestamps: true});

export const Review = models?.Review || model('Review', reviewSchema);