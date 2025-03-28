import { uploadRawLogToS3 } from "@workspace/s3-uploader";
import { summarizeLogs } from "@workspace/openai-llm";
import { prisma } from "@workspace/prisma-postgres";

const BUCKET_NAME = process.env.LOGS_BUCKET_NAME || "logassistantbucket";

export async function createLogEntry(rawLogText: string) {
  // 1) Upload raw log text to S3
  const { s3Key } = await uploadRawLogToS3(BUCKET_NAME, rawLogText);

  // 2) Summarize logs using OpenAI
  let summary: string | null = null;
  try {
    summary = await summarizeLogs(rawLogText);
  } catch (err) {
    // Decide whether you want partial success or to fail the entire call
    // Let’s just handle it gracefully and store summary = null
    console.error("Error summarizing logs:", err);
    summary = null;
  }

  // 3) Save to DB
  const newLog = await prisma.logEntry.create({
    data: {
      rawLogKey: s3Key,
      summary,
    }
  });

  return newLog;
}

export async function getLogEntry(id: number) {
  return await prisma.logEntry.findUnique({
    where: { id },
  });
}

export async function listLogEntries(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const logs = await prisma.logEntry.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });

  const totalCount = await prisma.logEntry.count();

  return {
    items: logs,
    totalCount,
    page,
    pageSize,
  };
}

/**
 * Basic text search on summary field
 */
export async function searchLogEntries(q: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const logs = await prisma.logEntry.findMany({
    where: {
      summary: { contains: q, mode: 'insensitive' },
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
  const totalCount = await prisma.logEntry.count({
    where: {
      summary: { contains: q, mode: 'insensitive' },
    },
  });
  return {
    items: logs,
    totalCount,
    page,
    pageSize,
  };
}