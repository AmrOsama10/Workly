import { diskStorage } from "multer";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { ImulterFile } from "@common/interfaces";

export const multerLocalOptions = ({ folder = 'public' }: { folder: string }): MulterOptions => {
    let basePath = `uploads/${folder}`;
    return {
        storage: diskStorage({
            destination(req: Request, file: Express.Multer.File, callback: Function) {
                const fullPath = path.resolve(`./${basePath}`);
                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath, { recursive: true });
                }
                callback(null, fullPath);
            },
            filename(req:Request, file:ImulterFile, callback:Function) {
                const filename = randomUUID() + "_" + file.originalname;
                file.finalPath = `${basePath}/${filename}`;
                callback(null, filename);
            },
        })
        
    };
};