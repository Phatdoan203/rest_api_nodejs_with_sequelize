
import db from '../models';
import { Op, where } from 'sequelize';
import {v4 as generateId} from 'uuid';
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Get All Book

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

// Create

export const CreateBook = (body, fileData) => new Promise( async (resolve, reject) => {
    try {
        const response = await db.Book.findOrCreate({
            where: { title: body.title },
            defaults: {
                ...body,
                id: generateId(),
                image: fileData?.path,
                filename: fileData?.filename
            }
        });
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Created' : 'Cannot create new book'
        });
        if (fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename);
    }
})

// Update

export const UpdateBook = ({ BookId, ...body }, fileData) => new Promise( async (resolve, reject) => {
    try {
        if(fileData) body.image = fileData?.path;
        const response = await db.Book.update(body, 
            { where: { id: BookId } }
        );
        console.log(response);
        resolve({
            err: response[0] > 0 ? 0 : 1,
            mes: response[0] > 0 ? `${response[0]} book updated` : 'Cannot update new book / Id not found'
        });
        if(fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename);
    }
})


// Delete Book
export const DeleteBook = (BookIds, filename) => new Promise( async (resolve, reject) => {
    try {
        const response = await db.Book.destroy( 
            { where: { id: BookIds } }
        );
        
        resolve({
            err: response[0] > 0 ? 0 : 1,
            mes: `${response[0]} books deleted`
        });
        cloudinary.api.delete_resources(filename);
    } catch (error) {
        reject(error);
    }
})
