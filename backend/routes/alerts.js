import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { city_name, threshold_value } = req.body;
    
    await pool.execute(
        'INSERT INTO alerts (user_id, city_name, threshold_value) VALUES (?, ?, ?)',
        [req.user.id, city_name, threshold_value]
    );
    
    res.json({ message: 'Alert created successfully' });
});

router.get('/', authenticateToken, async (req, res) => {
    const [alerts] = await pool.execute(
        'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
    );
    res.json(alerts);
});
// Add this to backend/routes/alerts.js
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM alerts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert' });
  }
});
export default router;