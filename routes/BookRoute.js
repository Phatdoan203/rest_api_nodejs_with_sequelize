const express = require('express');
const router = express.Router();
const book = require('../controllers/BookController')
// import verify_token from '../middleware/verify_token';
// import { isAdmin, isModeratorOrAdmin } from '../middleware/verify_roles';

const bookRoute = (app) => {
    // Public routes
    router.get('/',book.getBook)
    
    return app.use('/api/v2/book', router);
}


module.exports = bookRoute