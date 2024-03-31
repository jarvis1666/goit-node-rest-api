import path from 'path'
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';


const contactsPath = path.resolve('db', 'contacts.json');



async function listContacts() {
    try {
        const readContacts = await fs.readFile(contactsPath)
        const arrContacts = JSON.parse(readContacts)
        return arrContacts;
       
    } catch (error) {
        return error;
    }
    
}


async function getContactById(contactId) {
    try {
        const Contacts = await listContacts();
        const objContact = Contacts.find(contact => contact.id === contactId)
        return objContact || null;

    } catch (error) {
        return error;
    }
}

async function removeContact(contactId) {
    try {
        const Contacts =await listContacts();
        const idxContact = Contacts.findIndex(contact => contact.id === contactId);
        if (idxContact === -1) {
            return null;
        }
        const removedContact = Contacts.splice(idxContact, 1)[0]; 
        await fs.writeFile(contactsPath, JSON.stringify(Contacts, null, 2));
        return removedContact;

    } catch (error) {
        return error;
    }
}

async function addContact(name, email, phone) {
    try {
        const Contacts =await listContacts();
        const newContact = {
            id: uuidv4(),
            name: name,
            email: email,
            phone: phone,
        }
        Contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(Contacts, null, 2));

        return newContact;
      
    } catch (error) {
        return error;
  }
}
async function editContact(id, updateData) {
    try {
        const contactsData = await fs.readFile(contactsPath)
        const contacts = JSON.parse(contactsData)

        const contactIdx = contacts.findIndex(contact => contact.id === id)
        if (contactIdx === -1) {
            return null;
        }
        const currentContact = contacts[contactIdx]
       
        let updateContact = {
            id:id,
            name: " ",
            email: " ",
            phone: " "
        };
        
        if (currentContact.name === updateData.name || updateData.name === undefined) {
            updateContact.name = currentContact.name
        } else {
            updateContact.name = updateData.name;
        }
         if (currentContact.email === updateData.email || updateData.email === undefined) {
            updateContact.email = currentContact.email
        } else {
            updateContact.email = updateData.email;
         }
         if (currentContact.phone === updateData.phone || updateData.phone === undefined) {
            updateContact.phone = currentContact.phone
        } else {
            updateContact.phone = updateData.phone;
         }

        contacts[contactIdx] = updateContact;

        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updateContact
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
}