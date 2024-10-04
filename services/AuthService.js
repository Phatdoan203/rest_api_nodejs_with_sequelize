
import db from '../models';
import bcript, { genSaltSync } from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { notAuth } from '../middleware/handle_error';

require('dotenv').config();


const hashPassword = password => bcript.hashSync(password, genSaltSync(8));

export const register = ({ email, password }) => new Promise( async (resolve, reject) => {
    try{
        const response = await db.User.findOrCreate({
            where : { email },
            defaults:  {
                email, 
                password: hashPassword(password)
            }
        })
        
        // create token
        const accessToken = response[1]
            ? jwt.sign({id: response[0].id, email: response[0].email, role_code: response[0].role_code}, process.env.JWT_SECRET, { expiresIn: '5s' }) 
            : null;

        // JWT refresh token
        const refreshToken = response[1]
            ? jwt.sign({id: response[0].id}, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '10d' })
            : null;

        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Register Successfully' : 'Email is used',
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh_token' : refreshToken 
        })

        if(refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            },
            {
                where: { id: response[0].id }
            }
        )
        }

    } catch (error){
        reject(error);
    }
})



export const login = ({ email, password }) => new Promise( async (resolve, reject) => {
    try{
        const response = await db.User.findOne({
            where : { email },
            raw: true
        })
        // Boolean
        const isChecked = response && bcript.compareSync(password, response.password);
        const token = isChecked ? jwt.sign({id: response.id, email: response.email, role_code: response.role_code}, process.env.JWT_SECRET, { expiresIn: '30s' }) : null;

        // JWT refresh token
        const refreshToken = isChecked
            ? jwt.sign({id: response.id}, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '10d' })
            : null;

        resolve({
            err: token ? 0 : 1,
            mes: token ? 'Login Successfully' : response ? 'Password is wrong' : 'Email has not been registered' ,
            'access_token': token ? `Bearer ${token}` : token,
            'refresh_token' : refreshToken 
        })

        if(refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            },
            {
                where: { id: response[0].id }
            }
        )}
        

    } catch (error){
        reject(error);
    }
})


export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { refresh_token }
        });
        if(response){
            jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                if(err){
                    resolve({
                    err: 1,
                    mes: 'Refresh token expired, login again pls'
                    })
                } else{
                    const accessToken = response[1]
                        ? jwt.sign({id: response[0].id, email: response[0].email, role_code: response[0].role_code}, process.env.JWT_SECRET, { expiresIn: '5s' }) 
                        : null;
                    resolve({
                        err: accessToken ? 0 : 1,
                        mes: accessToken ? 'Ok' : 'Fail to generate new access token . Please try again ',
                        'access_token': token ? `Bearer ${token}` : token,
                        'refresh_token' : refreshToken
                    })
                }
            })
        }
    } catch (error) {
        reject(error)
    }
})