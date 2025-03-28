import { Router } from 'express';
import { LOG_ENDPOINT } from '../../constants/endpoint';
import {
  createLogEntry,
  getLogEntry,
  listLogEntries,
  searchLogEntries
} from './log.service';

export const router: Router = Router();

/**
 * POST /api/log
 * Body: { rawText: string }
 */
router.post(LOG_ENDPOINT, async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: 'Missing rawText in request body' });
    }

    const logRecord = await createLogEntry(rawText);
    return res.status(201).json(logRecord);
  } catch (error: any) {
    console.error('POST /api/log error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create log entry'
    });
  }
});

/**
 * GET /api/log
 * Query: page, pageSize
 */
router.get(LOG_ENDPOINT, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const results = await listLogEntries(page, pageSize);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error('GET /api/log error:', error);
    return res.status(500).json({ error: 'Failed to list log entries' });
  }
});

/**
 * GET /api/log/search
 * Query: q, page, pageSize
 */
router.get(LOG_ENDPOINT + '/search', async (req, res) => {
  try {
    console.log('hello world')
    const q = String(req.query.q || '');
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const results = await searchLogEntries(q, page, pageSize);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error('GET /api/log/search error:', error);
    return res.status(500).json({ error: 'Failed to search log entries' });
  }
});

/**
 * GET /api/log/:id
 */
router.get(LOG_ENDPOINT + '/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id param' });
    }
    const logRecord = await getLogEntry(id);
    if (!logRecord) {
      return res.status(404).json({ error: 'LogEntry not found' });
    }
    return res.status(200).json(logRecord);
  } catch (error: any) {
    console.error('GET /api/log/:id error:', error);
    return res.status(500).json({ error: 'Failed to retrieve log entry' });
  }
});
