
import mongoose from 'mongoose'
import {registerNewUser} from '../services/usersServices.js'
import HttpError from '../helpers/HttpError.js';



//Регістрація користувача
export const registerUserData = async (req, res, next) => {  
    const { email, password, subscription, token } = req.body;
    if (!email || !password) {
            return HttpError(400, 'Помилка від Joi або іншої бібліотеки валідації')
        }
    try {    
        const newUser = await registerNewUser(email, password, subscription, token);
        if (!newUser) {
            throw HttpError(404, error.message)
        }
        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch(error) {
        next(error)
    }
}