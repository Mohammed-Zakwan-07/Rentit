// =============================================
// Vehicle Routes (CRUD)
// =============================================

const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        res.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/vehicles - Add a new vehicle (admin only)
router.post('/', async (req, res) => {
    try {
        const { name, brand, model, price_per_day, role } = req.body;

        // Simple admin check
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Validate input
        if (!name || !brand || !model || !price_per_day) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [result] = await db.query(
            'INSERT INTO vehicles (name, brand, model, price_per_day) VALUES (?, ?, ?, ?)',
            [name, brand, model, price_per_day]
        );

        res.status(201).json({
            message: 'Vehicle added successfully',
            vehicle: { id: result.insertId, name, brand, model, price_per_day, status: 'available' }
        });
    } catch (error) {
        console.error('Add vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/vehicles/:id - Update a vehicle (admin only)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, model, price_per_day, status, role } = req.body;

        // Simple admin check
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await db.query(
            'UPDATE vehicles SET name = ?, brand = ?, model = ?, price_per_day = ?, status = ? WHERE id = ?',
            [name, brand, model, price_per_day, status, id]
        );

        res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/vehicles/:id - Delete a vehicle (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Simple admin check
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await db.query('DELETE FROM vehicles WHERE id = ?', [id]);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
