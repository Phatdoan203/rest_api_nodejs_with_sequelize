import db from '../models';


export const getOneUser = (userId) => new Promise( async (resolve, reject) => {
    try{
        const response = await db.User.findOne({
            where : { id: userId },
            attributes: {
                exclude: ['password', 'role_code']
            },
            include: [
                {
                    model: db.Roles,
                    as: 'roleData',
                    attributes: ['id', 'code', 'value']
                }
            ]
        });
        
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Get' : 'User Not Found',
            userData: response
        });
    } catch (error){
        reject(error);
    }
});