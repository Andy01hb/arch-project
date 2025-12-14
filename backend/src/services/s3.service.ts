import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock-key",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock-secret",
    },
});

export const generatePresignedDownloadUrl = async (fileKey: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || "arch-project-files",
        Key: fileKey,
    });

    // URL valid for 15 minutes
    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    return url;
};
