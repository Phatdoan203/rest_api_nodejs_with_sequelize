import * as services from "../services";
import { internalServerError, badRequest } from "../middleware/handle_error";

export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user;
        const response = await services.getOneUser(id);
        return res.status(200).json(response);

    } catch (error) {
        return internalServerError(res);
    }
}