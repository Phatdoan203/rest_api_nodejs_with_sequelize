import joi from 'joi';

// Validate email and password
export const email = joi.string().pattern(new RegExp('gmail.com$')).required();
export const password = joi.string().min(6).required();

// Validate create book
export const title = joi.string().required();
export const price = joi.number().required();
export const availible = joi.number().required();
export const category_code = joi.string().uppercase().alphanum().required();
export const image = joi.string().required();
export const BookId = joi.string().required();
export const BookIds = joi.array().required();
export const name = joi.string();
export const filename = joi.array().required();
export const RefreshToken = joi.string().required();