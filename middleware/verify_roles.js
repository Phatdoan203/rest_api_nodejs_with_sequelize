import { notAuth } from "./handle_error";

export const isAdmin = (req, res, next) => { 
    const { role_code } = req.user;
    if(role_code !== 'R1') return notAuth('Required role Admin', res);
    next();
}

export const isCreatorOrAdmin = (req, res, next) => {
    const { role_code } = req.user;
    if(role_code !== 'R1' && role_code !== 'R2') return notAuth('Required role Admin or Moderator', res);
    next()
}