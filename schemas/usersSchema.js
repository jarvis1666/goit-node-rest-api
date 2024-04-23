import { model, Schema } from "mongoose";
import Joi from "joi";

export const registerUserShema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
})

export const loginUserShema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
})
const usersShema = new Schema({
    password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
}, { versionKey: false })

export const user = model('users', usersShema)