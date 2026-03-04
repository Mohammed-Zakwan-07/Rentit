// =============================================
// Rentit - Express Server Entry Point
// =============================================

const express = require('express');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');
const driverRoutes = require('./routes/drivers');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());                    // Allow cross-origin requests
app.use(express.json());            // Parse JSON request bodies

// Routes
app.use('/api', authRoutes);        // /api/register, /api/login
app.use('/api/vehicles', vehicleRoutes);  // /api/vehicles
app.use('/api/bookings', bookingRoutes);  // /api/bookings
app.use('/api/drivers', driverRoutes);    // /api/drivers

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Rentit API is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Rentit server is running on http://localhost:${PORT}`);
});
