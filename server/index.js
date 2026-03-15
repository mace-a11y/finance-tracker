const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database ────────────────────────────────────────────────────
// Railway provides DATABASE_URL automatically when you add the PostgreSQL plugin
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Create table on startup if it doesn't exist
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS finance_data (
                id INTEGER PRIMARY KEY DEFAULT 1,
                data JSONB NOT NULL DEFAULT '{}',
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        // Ensure the single row exists
        await pool.query(`
            INSERT INTO finance_data (id, data) VALUES (1, '{}')
            ON CONFLICT (id) DO NOTHING
        `);
        console.log('Database initialised');
    } catch (err) {
        console.error('DB init error:', err.message);
    }
}

// ── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ── Routes ───────────────────────────────────────────────────────

// GET /api/data — return the full finance data JSON
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT data, updated_at FROM finance_data WHERE id = 1');
        if (result.rows.length === 0) {
            return res.json({ data: {}, updated_at: null });
        }
        res.json({ data: result.rows[0].data, updated_at: result.rows[0].updated_at });
    } catch (err) {
        console.error('GET /api/data error:', err.message);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// POST /api/data — replace the full finance data JSON
app.post('/api/data', async (req, res) => {
    try {
        const { data } = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Request body must be { data: {...} }' });
        }
        await pool.query(
            'UPDATE finance_data SET data = $1, updated_at = NOW() WHERE id = 1',
            [JSON.stringify(data)]
        );
        res.json({ ok: true, updated_at: new Date().toISOString() });
    } catch (err) {
        console.error('POST /api/data error:', err.message);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Start ────────────────────────────────────────────────────────
initDB().then(() => {
    app.listen(PORT, () => console.log(`Finance Tracker API running on port ${PORT}`));
});
