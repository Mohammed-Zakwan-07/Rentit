// =============================================
// Booking Routes
// =============================================

const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
    try {
        const { user_id, vehicle_id, driver_id, pickup_date, dropoff_date } = req.body;

        // Validate input
        if (!user_id || !vehicle_id || !pickup_date || !dropoff_date) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Get vehicle price
        const [vehicles] = await db.query('SELECT * FROM vehicles WHERE id = ?', [vehicle_id]);
        if (vehicles.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        const vehicle = vehicles[0];

        // Check if vehicle is available
        if (vehicle.status !== 'available') {
            return res.status(400).json({ error: 'Vehicle is not available' });
        }

        // Calculate total price (days × price_per_day)
        const pickup = new Date(pickup_date);
        const dropoff = new Date(dropoff_date);
        const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            return res.status(400).json({ error: 'Drop-off date must be after pickup date' });
        }

        const total_price = days * parseFloat(vehicle.price_per_day);

        // Insert booking
        const [result] = await db.query(
            'INSERT INTO bookings (user_id, vehicle_id, driver_id, pickup_date, dropoff_date, total_price) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, vehicle_id, driver_id || null, pickup_date, dropoff_date, total_price]
        );

        // Update vehicle status to 'booked'
        await db.query('UPDATE vehicles SET status = ? WHERE id = ?', ['booked', vehicle_id]);

        // If a driver was assigned, update their availability
        if (driver_id) {
            await db.query('UPDATE drivers SET availability = ? WHERE id = ?', ['unavailable', driver_id]);
        }

        res.status(201).json({
            message: 'Booking confirmed',
            booking: {
                id: result.insertId,
                user_id,
                vehicle_id,
                driver_id: driver_id || null,
                pickup_date,
                dropoff_date,
                total_price,
                status: 'confirmed'
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/bookings - Get all bookings (admin only)
router.get('/', async (req, res) => {
    try {
        const [bookings] = await db.query(`
      SELECT b.*, u.name AS user_name, v.name AS vehicle_name, d.name AS driver_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      ORDER BY b.created_at DESC
    `);
        res.json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/bookings/:userId - Get bookings for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [bookings] = await db.query(`
      SELECT b.*, v.name AS vehicle_name, v.brand AS vehicle_brand, d.name AS driver_name
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);
        res.json(bookings);
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/bookings/cancel/:id - Cancel a booking
router.put('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get booking details
        const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookings[0];

        // Update booking status to 'cancelled'
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', id]);

        // Update vehicle status back to 'available'
        await db.query('UPDATE vehicles SET status = ? WHERE id = ?', ['available', booking.vehicle_id]);

        // If a driver was assigned, make them available again
        if (booking.driver_id) {
            await db.query('UPDATE drivers SET availability = ? WHERE id = ?', ['available', booking.driver_id]);
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
