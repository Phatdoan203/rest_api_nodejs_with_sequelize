import * as services from '../services';
import { internalServerError, badRequest } from '../middleware/handle_error';
import { title, price, availible, category_code, image } from '../helpers/joi_schema';
import joi from 'joi';

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
        const { error } = joi.object({ title, price, availible, category_code, image }).validate(req.body);
        if (error) return badRequest(error.details[0].message, res);
        const response = await services.CreateBook(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}