import * as services from '../services';
import { internalServerError, badRequest } from '../middleware/handle_error'

export const getBook = async (req, res) => {
    try {
        const response = await services.getBook(req.query); // req.body
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res)
        
    }
}