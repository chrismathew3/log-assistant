import { prisma } from '@workspace/prisma-postgres'
import { generatePresignedGetUrl, uploadRawLogToS3 } from '@workspace/s3-uploader'
import { summarizeLogs } from '@workspace/openai-llm'
import { BUCKET_NAME } from './log.constants'


export const createLogEntry = async (rawLogText: string) => {
  const { s3Key } = await uploadRawLogToS3(BUCKET_NAME, rawLogText)
  let summary: string | null = null
  try {
    summary = await summarizeLogs(rawLogText)
  } catch (err) {
    console.error('Error summarizing logs:', err)
    summary = null
  }
  return prisma.logEntry.create({
    data: {
      rawLogKey: s3Key,
      summary,
    },
  })
}

export const getLogEntry = async (id: number) => {
  return prisma.logEntry.findUnique({
    where: { id },
  })
}

export const getLogEntryWithPresignedUrl = async (id: number) => {
  const logRecord = await getLogEntry(id);
  if (!logRecord) return null;

  let presignedUrl: string | null = null;
  if (logRecord.rawLogKey) {
    presignedUrl = await generatePresignedGetUrl(
      BUCKET_NAME,
      logRecord.rawLogKey,
      3600 // expires in 1 hour
    );
  }
  return {
    ...logRecord,
    presignedUrl,
  };
};


export const listLogEntries = async (page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize
  const items = await prisma.logEntry.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  })
  const totalCount = await prisma.logEntry.count()
  return { items, totalCount, page, pageSize }
}

export const searchLogEntries = async (q: string, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize
  const items = await prisma.logEntry.findMany({
    where: { summary: { contains: q, mode: 'insensitive' } },
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  })
  const totalCount = await prisma.logEntry.count({
    where: { summary: { contains: q, mode: 'insensitive' } },
  })
  return { items, totalCount, page, pageSize }
}