
import {listContacts, getContactByUserId, removeContact, addContact, editContact, updateStatus}  from '../services/contactsServices.js'
import HttpError from '../helpers/HttpError.js';
import { json } from 'express';
import mongoose from 'mongoose'
import { checkToken } from '../services/jwtServise.js';
// Отримання всіх контактів
export const getAllContacts = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
        const contacts = await listContacts(userId);
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};
//Отримання одного контакта 
export const getOneContact = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
    try {
        const contact = await getContactByUserId(userId);
        if (!contact) {
            throw  HttpError(404, 'Contact not found');
        }
        res.status(200).json(contact);
    } catch (error) {
        
        next(error);
    }
};
// Видалення контакта
export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }

    try {
        const removedContact = await removeContact(id, userId);
        if (!removedContact) {
            throw  HttpError(404);
        }
        res.status(200).json(removedContact);
    } catch (error) {
        next(error);
    }
};
// Створення нового контакта
export const createContact = async (req, res, next) => {
     const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
        const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
    const { name, email, phone } = req.body;
    try {
        const newContact = await addContact(name, email, phone, userId);
        if (!newContact) {
            throw  HttpError(404, error.message);
        }
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};
// Оновленя старого контакта по id
export const updateContact = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
    const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    if (!name && !email && !phone) {
        res.status(400).json({ message: 'Body must have at least one field' });
    }

    try {
        const updatedContact = await editContact(id, { name, email, phone, owner: userId }, userId);
        
        if (!updatedContact) {
           throw  HttpError(404);
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
// Додавання статусу кантакта
export const updateContactStatus = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
    const userId = checkToken(token)
    
        if (!userId) {
             throw HttpError(401, 'Uanauthorize... ')
        }
    const { id } = req.params;
    const { favorite } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        const newContact = await updateStatus(id, { favorite, owner: userId })
        if (!newContact) {
            throw HttpError(404);
        }
        res.status(200).json(newContact)
    } catch (error) {     
        next(error);
    }
}
