import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus
} from "../controllers/contactsControllers.js";
import { validateBody } from '../helpers/validateBody.js'
import {createContactSchema, updateContactSchema, updateContactFavoriteShema}from '../schemas/contactsSchemas.js'

const contactsRouter = express.Router();
// Отримання всіх контактів
contactsRouter.get("/", getAllContacts);

//Отримання одного контакта 
contactsRouter.get("/:id", getOneContact);

// Видалення контакта
contactsRouter.delete("/:id", deleteContact);

// Створення нового контакта
contactsRouter.post("/", validateBody(createContactSchema), createContact);

// Оновленя старого контакта по id
contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

// Додавання статусу кантакта
contactsRouter.patch("/:id/favorite", validateBody(updateContactFavoriteShema), updateContactStatus )

export default contactsRouter;
