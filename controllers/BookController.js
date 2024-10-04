import * as services from '../services';
import { internalServerError, badRequest } from '../middleware/handle_error';
import { title, price, availible, category_code, image , BookId, BookIds, filename} from '../helpers/joi_schema';
import joi from 'joi';
const cloudinary = require('cloudinary').v2;


//  Get All Book
export const getBook = async (req, res) => {
    try {
        const response = await services.getBook(req.query); // req.body
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res)
    }
}


// Create new book
export const createNewBook = async (req, res) => {
    try {
        const fileData = req.file;
        // console.log(fileData)
        const { error } = joi.object({ title, price, availible, category_code, image }).validate({...req.body, image: fileData?.path});
        if (error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        };
        const response = await services.CreateBook(req.body.BookIds, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}


//  Update book
export const updateBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = joi.object({ BookId }).validate({ BookId : req.body.BookId });
        console.log(error);
        if(error) { 
            if(fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        };
        const response = await services.UpdateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}


//  Delete book
export const deleteBook = async (req, res) => {
    try {
        const { error } = joi.object({ BookIds, filename }).validate(req.query);
        if(error) { 
            return badRequest(error.details[0].message, res);
        };
        const response = await services.DeleteBook(req.query.BookIds, req.query.filename);
        return res.status(200).json(response)
        
    } catch (error) {
        return internalServerError(res);
    }
}