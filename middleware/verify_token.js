import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth } from './handle_error';
require('dotenv').config();

const verify_token = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return notAuth('Require Authorization', res);
    const AccessToken = token.split(' ')[1];
    jwt.verify(AccessToken, process.env.JWT_SECRET, (err, user) => {
        if(err){
            const CheckToken = err instanceof TokenExpiredError;
            // console.log(CheckToken);
            if(!CheckToken) return notAuth('Access token invalid', res, CheckToken)
            if(CheckToken) return notAuth('Access token maybe expired', res, CheckToken);
        }

        req.user = user;
        next();
    })
}

export default verify_token