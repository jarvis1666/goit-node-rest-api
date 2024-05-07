import { model, Schema } from "mongoose";
import Joi from "joi";

export const registerUserShema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    avatarURL: Joi.string(),
    subscription: Joi.string(),
    token: Joi.string(),
    verify: Joi.boolean(),
    verificationToken: Joi.string()
})

export const loginUserShema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
})
export const reVerificationShema = Joi.object({
  email: Joi.string()
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
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  }, 
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}, { versionKey: false })

export const user = model('users', usersShema)