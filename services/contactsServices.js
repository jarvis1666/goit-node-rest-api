import path from 'path'
import { contact } from '../schemas/contactsSchemas.js'
import { user } from '../schemas/usersSchema.js';


const contactsPath = path.resolve('db', 'contacts.json');


// Отримання всіх контактів
async function listContacts(userId) {
    try {
        const readContacts = await contact.find({owner: userId})
        
        return readContacts;
       
    } catch (error) {
        return error;
    }
    
}

//Отримання одного контакта 
async function getContactByUserId(userId, userOwner) {
    try {
        const Contacts = await listContacts(userOwner)
        // console.log(userId)
        // console.log(userOwner)
        const Contact = await Contacts.find(userId)
        
        return Contact || null;

    } catch (error) {
        return error;
    }
}
// Видалення контакта
async function removeContact(contactId, userId) {
    try {
        
        const removedContact = await contact.findOneAndDelete({_id: contactId, owner: userId });
        return removedContact || null;

    } catch (error) {
        return error;
    }
}
// Створення нового контакта
async function addContact(name, email, phone, userId) {
    try {
       const newContact = await contact.create({ owner: userId, name, email, phone });
        return newContact;

      
    } catch (error) {
        return error;
  }
}
// Оновленя старого контакта по id
async function editContact(id, updateData) {
    try {      
        const updatedContact = await contact.findByIdAndUpdate(id, updateData, { new: true });
        return updatedContact;
    } catch (error) {
        return error;
    }
}
// Додавання статусу кантакта
async function updateStatus(contactId, body) {
    try {
        const upContact = await contact.findByIdAndUpdate(contactId, body, { new: true })
        return upContact
    } catch (error) {
        return error;
    }
}
export {
    listContacts,
    getContactByUserId,
    removeContact,
    addContact,
    editContact,
    updateStatus,
}