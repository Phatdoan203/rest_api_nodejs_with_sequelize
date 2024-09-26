import { defaults } from 'joi';
import db from '../models';
import { Op } from 'sequelize';
import {v4 as generateId} from 'uuid';
require('dotenv').config();

export const getBook = ({ page, limit, order, name, ...query }) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };             //queries chứa các tùy chọn cho việc thực hiện truy vấn, chẳng hạn như offset, limit, và các tùy chọn khác.
        const offset = (!page || +page <= 1 ) ? 0 : (+page - 1);
        const finalLimit = +limit || +process.env.LIMIT_BOOK; 
        queries.offset = offset * finalLimit;                  // Tính toán vị trí bắt đầu
        queries.limit = finalLimit;                            // Số lượng bản ghi cần lấy
        if (order) {                                           // Nếu có yêu cầu sắp xếp
            queries.order = [order];
        };
        if (name) {
            query.title = { [Op.substring]: name };
        };
        
        const response = await db.Book.findAndCountAll({
            where: query,                                      // query được sử dụng để chứa các điều kiện lọc mà bạn muốn áp dụng vào truy vấn cơ sở dữ liệu.
            ...queries,                                        // ...queries: Dấu ba chấm ở đây cho phép bạn thêm tất cả các thuộc tính trong đối tượng queries vào đối tượng cấu hình truy vấn
            attributes: {
                exclule: ['category_code']
            },
            include: [
                { model: db.Category, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'categoryData'}
            ]                                        
        });
        
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Cannot Found Book',
            bookData: response
        })
        
    } catch (error) {
        // console.log(error)
        reject(error);
    }
})



export const CreateBook = (body) => new Promise( async (resolve, reject) => {
    try {
        const response = await db.Book.findOrCreate({
            where: { title: body.title },
            defaults: {
                ...body,
                id: generateId()
            }
        });
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Created' : 'Cannot create new book'
        });
    } catch (error) {
        reject(error);
    }
})

// import db from '../models';
// import { Op } from 'sequelize';
// require('dotenv').config();

// export const getBook = ({ page, limit, order, name, availible, id, ...query }) => new Promise(async (resolve, reject) => {
//     try {
//         const queries = { raw: true, nest: true };
//         const offset = (!page || +page <= 1) ? 0 : (+page - 1);
//         const finalLimit = +limit || +process.env.LIMIT_BOOK || 10;

//         queries.offset = offset * finalLimit;
//         queries.limit = finalLimit;

//         if (order) {
//             queries.order = [[order.column || 'id', order.direction || 'ASC']];
//         }

//         // Xây dựng điều kiện tìm kiếm
//         const whereConditions = {};

//         // Kiểm tra id
//         if (id) {
//             const parsedId = +id;
//             if (!isNaN(parsedId)) {
//                 whereConditions.id = parsedId;
//             } else {
//                 return reject({ err: 1, mes: 'Invalid ID format' });
//             }
//         }

//         // Kiểm tra availible
//         if (availible !== undefined) {
//             const parsedAvailible = +availible;
//             if (!isNaN(parsedAvailible)) {
//                 whereConditions.availible = parsedAvailible;
//             }
//         }

//         // Kiểm tra title
//         if (name) {
//             whereConditions.title = { [Op.substring]: name };
//         }

//         // Nếu không có điều kiện nào, trả về lỗi
//         if (Object.keys(whereConditions).length === 0) {
//             return reject({ err: 1, mes: 'No valid query parameters provided' });
//         }

//         // Truy vấn cơ sở dữ liệu
//         const response = await db.Book.findAndCountAll({
//             where: whereConditions,
//             ...queries
//         });

//         // Trả về kết quả
//         resolve({
//             err: response ? 0 : 1,
//             mes: response ? 'Got' : 'Cannot find books',
//             bookData: response.rows || [],
//             count: response.count
//         });
//     } catch (error) {
//         console.error('Error fetching books:', error);
//         reject({ err: 1, mes: 'Internal Server Error' });
//     }
// });


