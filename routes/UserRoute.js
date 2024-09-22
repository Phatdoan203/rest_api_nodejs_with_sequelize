const express = require('express');
const router = express.Router();
const user = require('../controllers/UserControllers')

const userRoute = (app) => {
    router.get('/', user.getUser);
    return app.use('/api/v2/user', router);
}


module.exports = userRoute