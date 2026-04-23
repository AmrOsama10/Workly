import * as bcrypt from 'bcrypt';

export const generateHash =  (data: string) => {
    return bcrypt.hashSync(data, 10);
};

export const compareHash =  (data: string, hash: string) => {
    return bcrypt.compareSync(data, hash);
};
