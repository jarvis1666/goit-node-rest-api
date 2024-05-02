
import {registerNewUser, loginOldUser, logoutUser, getUserForToken, sendEmail} from '../services/usersServices.js'
import  HttpError  from '../helpers/HttpError.js';
import { user } from '../schemas/usersSchema.js';
import { checkToken } from '../services/jwtServise.js'
import path from 'path'
import { promises as fs } from "fs";
import { fileURLToPath } from 'url';
import Jimp from "jimp";
import { v4 as uuidv4 } from 'uuid';





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
    
        const currentUser = await getUserForToken(req, next)
     
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
      
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const avatarsDir = path.join(__dirname, "../", "public", "avatars");


//Оновлення аватару
export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "Avatar not found!"})
        }
        const { path: tempUpload, originalname } = req.file;
        
        const currentUser = await getUserForToken(req, next)
        if (!currentUser) {
            return;
        }
        const { _id } = currentUser;
   
        const avatarRenamed = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, avatarRenamed);

        await fs.rename(tempUpload, resultUpload)
        const avatar = await Jimp.read(resultUpload);
        const resizeAvatar = await avatar.resize(250, 250);
        await resizeAvatar.write(resultUpload);  

    const avatarURL = path.join("avatars", avatarRenamed);
    await user.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error)
  }
};
//Отримання користувача по verificationToken та веріфікація

export const getUserforVerificationToken = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        // const OneVerificationToken = verificationToken.slice(1)
      
        const userPoVerificationToken = await user.findOne({verificationToken: verificationToken});
        
        if (!userPoVerificationToken) {
            throw HttpError(404, "User not found!")
        }
        
        // console.log(userPoVerificationToken)
        userPoVerificationToken.verificationToken = null;
        userPoVerificationToken.verify = true;
        await user.updateOne({verificationToken: verificationToken}, {verificationToken: userPoVerificationToken.verificationToken, verify: userPoVerificationToken.verify})
         
         return res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        next(error)
    }
}
//повторна відправка email користувачу з посиланням для верифікації
export const reVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({message:"missing required field email"})
        }
        const userForReVerification = await user.findOne({ email })
        if (!userForReVerification) {
            throw HttpError(404, 'User not found!')
        }
        if (userForReVerification.verify === true) {
            return res.status(400).json({message:"Verification has already been passed"})
        }
        const verificationToken = uuidv4(); 
        // console.log(userForReVerification);
        await sendEmail(email, verificationToken);
        const userUpdate = await user.findOneAndUpdate({email}, {verificationToken})
        
        return res.status(200).json({message: "Verification email sent"});
    } catch (error) {
        next(error)
    }
}