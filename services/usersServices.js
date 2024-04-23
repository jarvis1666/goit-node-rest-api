
import bcrypt from 'bcrypt';
import HttpError from '../helpers/HttpError.js';
import { user } from '../schemas/usersSchema.js';
import {checkToken} from '../services/jwtServise.js'
import { singToken } from '../services/jwtServise.js'
import { url } from 'gravatar';
import { ImegeServise } from './imageServises.js';

//Регістрація користувача
async function registerNewUser(email, password, subscription, token) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarURL =`http:${url(email)}?d=robohash`
       console.log(avatarURL)
        const newUser = await user.create({ email, password: hashedPassword, avatarURL, subscription, token });

        
        
        return newUser;
    } catch (error) {
        return error;
    }
}
//Отримання токену
async function getUserForToken(req, next) {
    try {

        const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        console.log(token)
        const userId = checkToken(token)
        
        if (!userId) {
             throw HttpError(401, 'Email or password is wrong')
        }
        const currentUser = await user.findById(userId)
        // console.log(currentUser)
        if (!currentUser) {
            throw HttpError(401, 'Email or password is wrong')
        }
        
        if (currentUser.token !== token) {
            throw HttpError(401, 'Invalid token');
        }

        return currentUser;
    } catch (error) {
       next(error)
    }
}

//Логінення користувача
async function loginOldUser(email, password, existingUser, next) {
    try {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
              throw HttpError(401, 'Email or password is wrong')
        }
        
        const token = singToken(existingUser._id);
        await user.findOneAndUpdate({ email }, { token });
        
        return {
            token,
            user: {
                email: existingUser.email,
                subscription: existingUser.subscription
            }
        };
    } catch (error) {
        next(error)
    }
}

// Логаут користувача
async function logoutUser(userId) {
    try {
        const currentUser = await user.findById(userId);
        if (!currentUser) {
            throw HttpError(401, 'Not authorized');
        }

        await user.findByIdAndUpdate(userId, { token: null })
        
    } catch (error) {
        return error;
    }
}
////Оновлення аватару
async function avaratData(userData, user, file) {
    if (file) {
        user.avatarURL = await ImegeServise.saveImage(
            file,
            {
                maxFileSize: 2,
                width: 200,
                height: 200,
            }
        )
    }
    Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();

}
export {
    registerNewUser,
    loginOldUser,
    logoutUser,
    getUserForToken,
    avaratData,
}
