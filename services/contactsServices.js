import path from 'path'
import { contact } from '../schemas/contactsSchemas.js'


const contactsPath = path.resolve('db', 'contacts.json');


// Отримання всіх контактів
async function listContacts() {
    try {
        const readContacts = await contact.find()
        
        return readContacts;
       
    } catch (error) {
        return error;
    }
    
}

//Отримання одного контакта 
async function getContactById(contactId) {
    try {
        const Contacts = await contact.findById(contactId)
        return Contacts || null;

    } catch (error) {
        return error;
    }
}
// Видалення контакта
async function removeContact(contactId) {
    try {
        
        const removedContact = await contact.findByIdAndDelete(contactId);
        return removedContact || null;

    } catch (error) {
        return error;
    }
}
// Створення нового контакта
async function addContact(name, email, phone) {
    try {
       const newContact = await contact.create({ name, email, phone });
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
    getContactById,
    removeContact,
    addContact,
    editContact,
    updateStatus,
}