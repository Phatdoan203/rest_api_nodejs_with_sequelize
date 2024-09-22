import * as services from "../services";
import { internalServerError, badRequest } from "../middleware/handle_error";
import joi from 'joi';
import { email, password } from "../helpers/joi_schema";

export const register = async (req, res) => {
    try {
        // Validate with joi
        const { error } = joi.object({email, password}).validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);
        // 
        const response = await services.register(req.body);
        return res.status(200).json(response);

    } catch (error) {
        return internalServerError(res);
    }
}


export const login = async (req, res) => {
    try {
        // Validate with joi
        const { error } = joi.object({email, password}).validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);
        // 
        const response = await services.login(req.body);
        return res.status(200).json(response);

    } catch (error) {
        return internalServerError(res);
    }
}