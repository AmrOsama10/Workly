import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class S3Service {

    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME as string;

        this.s3Client = new S3Client({
            region: process.env.AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            }
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${randomUUID()}.${fileExtension}`;

        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    async deleteFile(fileUrl: string): Promise<void> {
        const key = fileUrl.split('.amazonaws.com/')[1];

        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        }));
    }

 

// async getPresignedUrl(key: string,): Promise < string > {
//     const command = new GetObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//     });

//     return await getSignedUrl(this.s3Client, command);
// }
}