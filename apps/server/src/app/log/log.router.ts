// apps/server/src/app/log/log.router.ts
import { Router } from "express";
import { LOG_ENDPOINT, LOG_SEARCH_ENDPOINT } from "../../constants/endpoint";
import {
  createLogEntry,
  getLogEntry,
  getLogEntryWithPresignedUrl,
  listLogEntries,
  searchLogEntries,
} from "./log.service";
import { generatePresignedGetUrl } from "@workspace/s3-uploader";
import { BUCKET_NAME } from "./log.constants";
import { logger } from "../../logger";

export const router: Router = Router();

// POST /api/log
router.post(LOG_ENDPOINT, async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: "Missing rawText in request body" });
    }
    const logRecord = await createLogEntry(rawText);
    return res.status(201).json(logRecord);
  } catch (error: any) {
    logger.error("POST /api/log error:", error);
    return res.status(500).json({ error: error.message || "Failed to create log entry" });
  }
});

// GET /api/log
router.get(LOG_ENDPOINT, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const results = await listLogEntries(page, pageSize);
    return res.status(200).json(results);
  } catch (error: any) {
    logger.error("GET /api/log error:", error);
    return res.status(500).json({ error: "Failed to list log entries" });
  }
});

// GET /api/log/search
router.get(LOG_SEARCH_ENDPOINT, async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const results = await searchLogEntries(q, page, pageSize);
    return res.status(200).json(results);
  } catch (error: any) {
    logger.error("GET /api/log/search error:", error);
    return res.status(500).json({ error: "Failed to search log entries" });
  }
});

// GET /api/log/:id
router.get(`${LOG_ENDPOINT}/:id`, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid id param" });
    }
    const logWithUrl = await getLogEntryWithPresignedUrl(id);
    if (!logWithUrl) {
      return res.status(404).json({ error: "LogEntry not found" });
    }
    return res.status(200).json(logWithUrl);
  } catch (error: any) {
    logger.error("GET /api/log/:id error:", error);
    return res.status(500).json({ error: "Failed to retrieve log entry" });
  }
});
