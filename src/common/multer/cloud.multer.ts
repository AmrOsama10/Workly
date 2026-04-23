import { BadRequestException } from "@nestjs/common";
import multer from "multer";
import { Request } from "express"; 

export enum CloudStorage {
    MEMORY = 'memory',
    DISK = 'disk'
}

export interface MulterOptions {
    allowedMimeTypes?: string[];
    maxFileSizeInMB?: number;
}

export const cloudMulter = ({
    storageApproach = CloudStorage.MEMORY,
    options = { allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"], maxFileSizeInMB: 5 }
}: {
    storageApproach?: CloudStorage;
    options?: MulterOptions;
} = {}): multer.Options => {

    const { allowedMimeTypes, maxFileSizeInMB } = options;

    const storage = storageApproach === CloudStorage.MEMORY
        ? multer.memoryStorage()
        : multer.diskStorage({});

    const fileFilter: multer.Options['fileFilter'] = async (_req: Request, file: Express.Multer.File, cb: Function) => {
        
        if (allowedMimeTypes && allowedMimeTypes.length > 0) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
            }
        }
        cb(null, true);
    };

    return {
        storage,
        fileFilter,
        limits: {
            fileSize: maxFileSizeInMB ? maxFileSizeInMB * 1024 * 1024 : undefined,
        }
    };
};