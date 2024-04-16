import jwt from 'jsonwebtoken'
import HttpError from '../helpers/HttpError.js';


//підписуємо токін
export const singToken =  ( _id) => 
        jwt.sign({ _id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN })

//Пепевірка токена для подальшого використовування
export const checkToken = (token) => {
    if (!token) {
        throw HttpError(401, 'Unauthorized...')
    }
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        return _id;
    } catch (error) {
         throw HttpError(401, 'Unauthorized...')
    }
}