
import bcrypt from 'bcrypt';
import HttpError from '../helpers/HttpError.js';
import { user } from '../schemas/usersSchema.js';

async function registerNewUser(email, password, subscription, token) {
    try {
        const existingUser = await user.findOne({ email });
        
        if (existingUser) {
            throw new HttpError(409, 'Користувач з такою поштою вже існує');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({ email, password: hashedPassword, subscription, token });
        // await newUser.save();
        return newUser;
    } catch (error) {
        return error;
    }
}
export {
    registerNewUser,
}