import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/api/addDefinitions', async (req, res) => {
  console.log('POST /api/addDefinitions hit');
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const result = await pool.query(
      'INSERT INTO public.definitions (text) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ DB insert error:', err);
    res.status(500).json({ error: 'Failed to insert' });
  }
});

export default router;
