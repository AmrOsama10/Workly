import jwt from "jsonwebtoken";

export const generateToken = ({ payload,
    secretKey = process.env.JWT_SECRET_KEY as string,
     options = { expiresIn: '1h' }}:
    {
        payload: Record<string, any>,
       secretKey?: string,
       options?: jwt.SignOptions 
     }) => {
    return jwt.sign(payload, secretKey, options)
}

export const verifyToken = ({ token,
     secretKey = process.env.JWT_SECRET_KEY as string }:
     { token: string, secretKey?: string }) => {
    return jwt.verify(token, secretKey)
}