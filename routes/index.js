const express = require('express');
const router = express.Router();
import { notFound } from '../middleware/handle_error';
import bookRoute from './BookRoute';

const userRoute = require('./UserRoute');
const authRoute = require('./AuthRoute');

const indexRoute = (app) => {
    userRoute(app);
    authRoute(app);
    bookRoute(app);
    router.use(notFound);
    return app.use('/', router)
}

module.exports = indexRoute