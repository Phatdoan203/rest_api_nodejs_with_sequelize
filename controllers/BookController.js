import * as services from '../services';
import { internalServerError, badRequest } from '../middleware/handle_error';
import { title, price, availible, category_code, image } from '../helpers/joi_schema';
import joi from 'joi';
const cloudinary = require('cloudinary').v2;

export const getBook = async (req, res) => {
    try {
        const response = await services.getBook(req.query); // req.body
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res)
        
    }
}

export const createNewBook = async (req, res) => {
    try {
        const fileData = req.file;
        // console.log(fileData)
        const { error } = joi.object({ title, price, availible, category_code, image }).validate({...req.body, image: fileData?.path});
        if (error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        };
        const response = await services.CreateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}