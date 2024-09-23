import jwt from 'jsonwebtoken';
import { notAuth } from './handle_error';
require('dotenv').config();

const verify_token = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return notAuth('Require Authorization', res);
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if(err) return notAuth('Access token maybe expired or invalid', res);

        req.user = user;
        next();
    })
}

export default verify_token