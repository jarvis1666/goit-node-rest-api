
import {registerNewUser, loginOldUser, logoutUser, getUserForToken} from '../services/usersServices.js'
import  HttpError  from '../helpers/HttpError.js';
import { user } from '../schemas/usersSchema.js';
import { checkToken} from '../services/jwtServise.js'
import { response } from 'express';




//Регістрація користувача
export const registerUserData = async (req, res, next) => {  
    const { email, password, subscription, token } = req.body;

    if (!email || !password) {
            throw HttpError(400, 'Помилка від Joi або іншої бібліотеки валідації')
    }
    
    try {   
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Користувач з такою поштою вже існує' });
        }

        const newUser = await registerNewUser(email, password, subscription, token);

        if (!newUser) {
            throw HttpError(404, error.message)
        }

        const responseNewUser = {
            user: {
                email: email,
                subscription: subscription || 'starter',
            }
        }

        res.status(201).json(responseNewUser);
    } catch(error) {
        next(error)
    }
}
//Логінення користувача
export const loginUserData = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw HttpError(400, 'Помилка від Joi або іншої бібліотеки валідації');
        }
        
        const existingUser = await user.findOne({ email });
        // console.log(existingUser);
        if (!existingUser) {
            throw  HttpError(401, 'Email or password is wrong ')
        }

        const loginUser = await loginOldUser(email, password, existingUser, next);
        // console.log(loginUser)
        if (!loginUser) {
            throw HttpError(404, error.message);
        }
        
        res.status(200).json(loginUser);
    } catch (error) {
        next(error);
    }
};
//Отримання та перевірка юзера по токену та id
export const userToken = async (req, res, next) => {
    try {
    
        const currentUser = await getUserForToken(req)
     
        req.user = currentUser;
        
        const responseCurrentUser = {
            email: currentUser.email,
            subscription: currentUser.subscription
        }
        res.status(200).json(responseCurrentUser) 
    } catch (error) {
        next(error)
    }
}

// Логаут користувача
export const logoutUserData = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
    
        
        const foundUser = await user.findById(userId);
        if (!foundUser || foundUser.token !== token) {
            throw HttpError(401, 'Invalid token');
        }

       
        req.user = await logoutUser(userId);
        // res.cookie('token', null, { expires: new Date(0) });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};