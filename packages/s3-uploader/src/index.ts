import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: process.env.S3_REGION ?? "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ""
  }
});

export async function uploadRawLogToS3(bucketName: string, rawLogText: string): Promise<{ s3Key: string; }> {
  const timestamp = Date.now();
  const s3Key = `logs/${timestamp}.txt`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: rawLogText,
      ContentType: "text/plain",
    })
  );

  return { s3Key };
}

export async function generatePresignedGetUrl(
  bucketName: string,
  s3Key: string,
  expiresIn = 3600 // 1 hour
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}