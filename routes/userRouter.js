import express from "express";
import { registerUserData, loginUserData, logoutUserData, userToken, updateAvatar } from '../controllers/usersControllers.js'
import { registerUserShema, loginUserShema } from '../schemas/usersSchema.js'
import { validateBody } from '../helpers/validateBody.js'
import  upload  from '../services/imageServises.js'




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

//Оновлення аватарки
usersRouter.patch("/avatars", upload.single("avatarURL"), updateAvatar)


export default usersRouter;