import bcrypt from "bcrypt";

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,10);
}

export const passwordValidator = (plain, hashed) =>
    bcrypt.compareSync(plain,hashed);