import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/api/getDefinitions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT text FROM public.definitions ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Failed to get definitions' });
  }
});

export default router;
