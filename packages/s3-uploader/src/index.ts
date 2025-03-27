import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ""
  }
});


export async function uploadRawLogToS3(bucketName: string, rawLogText: string): Promise<string> {
  const timestamp = Date.now();
  const s3Key = `logs/${timestamp}.txt`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: rawLogText,
      ContentType: "text/plain"
    })
  );

  return s3Key;
}