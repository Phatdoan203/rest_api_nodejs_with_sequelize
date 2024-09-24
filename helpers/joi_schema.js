import joi from 'joi';

// Validate email and password
export const email = joi.string().pattern(new RegExp('gmail.com$')).required();
export const password = joi.string().min(6).required();