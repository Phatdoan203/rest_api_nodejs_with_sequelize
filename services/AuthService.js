import { where } from 'sequelize';
import db from '../models';
import bcript, { genSaltSync } from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
        const token = response[1] ? jwt.sign({id: response[0].id, email: response[0].email, role_code: response[0].role_code}, process.env.JWT_SECRET, { expiresIn: '5d' }) : null;
        
        
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Register Successfully' : 'Email is used',
            'access_token': token ? `Bearer ${token}` : token
        })

        resolve({
            err: 0,
            mes: 'register service'
        })

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
        const token = isChecked ? jwt.sign({id: response.id, email: response.email, role_code: response.role_code}, process.env.JWT_SECRET, { expiresIn: '5d' }) : null;

        resolve({
            err: token ? 0 : 1,
            mes: token ? 'Login Successfully' : response ? 'Password is wrong' : 'Email has not been registered' ,
            'access_token': token ? `Bearer ${token}` : token
        })

        resolve({
            err: 0,
            mes: 'login service'
        })

    } catch (error){
        reject(error);
    }
})