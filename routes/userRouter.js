import express from "express";
import { registerUserData, loginUserData, logoutUserData, userToken } from '../controllers/usersControllers.js'
import { registerUserShema, loginUserShema } from '../schemas/usersSchema.js'
import { validateBody } from '../helpers/validateBody.js'




const usersRouter = express.Router();
// usersRouter.use(userToken)
// Регістрація користувача
usersRouter.post("/register", validateBody(registerUserShema), registerUserData)

//Логінення користуача
usersRouter.post("/login", validateBody(loginUserShema), loginUserData)

//Перевірка користувача
usersRouter.get("/current", userToken)

//Логаут користувача
usersRouter.post("/logout", logoutUserData, userToken)


export default usersRouter;