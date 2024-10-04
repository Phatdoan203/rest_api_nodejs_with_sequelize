import * as controllers from '../controllers';
import express from 'express';
const router = express.Router();

const authRoute = (app) => {
    router.post('/register', controllers.register)
    router.post('/login', controllers.login)
    router.post('/refresh_token', controllers.RefreshTokenController)
    return app.use('/api/v2/auth', router);
}

module.exports = authRoute