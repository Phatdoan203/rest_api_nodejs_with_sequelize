const express = require('express');
const router = express.Router();
const book = require('../controllers/BookController')
import verify_token from '../middleware/verify_token';
import { isAdmin, isModeratorOrAdmin } from '../middleware/verify_roles';
import uploadCloud from '../middleware/uploader';

const bookRoute = (app) => {
    // Public routes
    router.get('/',book.getBook)
    

    // Private routes
    router.use(verify_token);
    router.use(isAdmin);
    router.post('/addNewBook', uploadCloud.single('image'), book.createNewBook)
    return app.use('/api/v2/book', router);
}


module.exports = bookRoute