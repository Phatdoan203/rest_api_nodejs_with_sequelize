const express = require('express');
const router = express.Router();
const book = require('../controllers/BookController')
import verify_token from '../middleware/verify_token';
import { isAdmin, isCreatorOrAdmin} from '../middleware/verify_roles';
import uploadCloud from '../middleware/uploader';

const bookRoute = (app) => {
    // Public routes
    router.get('/',book.getBook)
    

    // Private routes
    router.use(verify_token);
    router.use(isCreatorOrAdmin);
    router.post('/Add', uploadCloud.single('image'), book.createNewBook);
    router.put('/Update', uploadCloud.single('image'), book.updateBook);
    router.delete('/Delete', book.deleteBook);
    return app.use('/api/v2/book', router);
}


module.exports = bookRoute