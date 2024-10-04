const express = require('express');
const router = express.Router();
const user = require('../controllers/UserControllers')
import verify_token from '../middleware/verify_token';
import { isAdmin, isCreator } from '../middleware/verify_roles';

const userRoute = (app) => {
    // Public routes

    // Private routes
    router.use(verify_token);
    // router.use(isCreator);
    router.get('/', user.getCurrent);
    return app.use('/api/v2/user', router);
}


module.exports = userRoute