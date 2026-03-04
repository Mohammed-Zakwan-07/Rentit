// =============================================
// Driver Routes
// =============================================

const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/drivers - Get all drivers
router.get('/', async (req, res) => {
    try {
        const [drivers] = await db.query('SELECT * FROM drivers ORDER BY name ASC');
        res.json(drivers);
    } catch (error) {
        console.error('Get drivers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/drivers - Add a new driver (admin only)
router.post('/', async (req, res) => {
    try {
        const { name, phone, role } = req.body;

        // Simple admin check
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Validate input
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }

        const [result] = await db.query(
            'INSERT INTO drivers (name, phone) VALUES (?, ?)',
            [name, phone]
        );

        res.status(201).json({
            message: 'Driver added successfully',
            driver: { id: result.insertId, name, phone, availability: 'available' }
        });
    } catch (error) {
        console.error('Add driver error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
