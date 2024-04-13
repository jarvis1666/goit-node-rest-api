import express from "express";
import { registerUserData } from '../controllers/usersControllers.js'
import { registerUserShema } from '../schemas/usersSchema.js'
import { validateBody } from '../helpers/validateBody.js'




const usersRouter = express.Router();

// Регістрація користувача
usersRouter.post("/register", validateBody(registerUserShema), registerUserData)

export default usersRouter;