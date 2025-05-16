const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Helper to get userId from session username
async function getUserIdFromSession(req) {
  const username = req.session?.username;
  if (!username) return null;
  const [rows] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
  if (rows.length === 0) return null;
  return rows[0].id;
}

// Get all favorites for a user
router.get('/', async (req, res) => {
    try {
        const userId = await getUserIdFromSession(req);
        if (!userId) return res.status(401).json({ success: false, message: 'Not logged in' });
        const [favorites] = await pool.execute(`
            SELECT f.*, l.* 
            FROM favorites f
            JOIN locations l ON f.location_id = l.id
            WHERE f.user_id = ?
        `, [userId]);

        res.json({ success: true, favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, message: 'Error fetching favorites' });
    }
});

// Add a location to favorites
router.post('/', async (req, res) => {
    try {
        const userId = await getUserIdFromSession(req);
        if (!userId) return res.status(401).json({ success: false, message: 'Not logged in' });
        
        console.log('=== Adding Favorite ===');
        console.log('Request body:', req.body);
        
        // Extract and validate data
        const {
            name = '',
            address = '',
            zip_code = null,
            latitude = null,
            longitude = null,
            category = null,
            subcategory = null
        } = req.body;

        console.log('Processed data:', {
            name, address, zip_code, latitude, longitude, category, subcategory
        });

        // Validate required fields
        if (!name || !address) {
            console.log('Validation failed: Missing name or address');
            return res.status(400).json({
                success: false,
                message: 'Name and address are required'
            });
        }

        // First, insert location
        console.log('Inserting location...');
        const [locationResult] = await pool.execute(`
            INSERT INTO locations (name, address, zip_code, latitude, longitude, category, subcategory)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                address = VALUES(address),
                zip_code = VALUES(zip_code),
                latitude = VALUES(latitude),
                longitude = VALUES(longitude),
                category = VALUES(category),
                subcategory = VALUES(subcategory),
                id = LAST_INSERT_ID(id)
        `, [name, address, zip_code, latitude, longitude, category, subcategory]);

        const locationId = locationResult.insertId;
        console.log('Location inserted/updated, ID:', locationId);

        // Then add to favorites
        console.log('Adding to favorites...');
        console.log('User ID:', userId);
        console.log('Location ID:', locationId);

        await pool.execute(`
            INSERT INTO favorites (user_id, location_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
        `, [userId, locationId]);

        console.log('Successfully added to favorites');

        res.json({ 
            success: true, 
            message: 'Location added to favorites',
            locationId: locationId
        });
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        });
        res.status(500).json({ 
            success: false, 
            message: `Error adding to favorites: ${error.message}`,
            details: error.sqlMessage || error.message
        });
    }
});

// Remove from favorites
router.delete('/:locationId', async (req, res) => {
    try {
        const userId = await getUserIdFromSession(req);
        if (!userId) return res.status(401).json({ success: false, message: 'Not logged in' });
        const { locationId } = req.params;

        console.log('=== Removing Favorite ===');
        console.log('User ID:', userId);
        console.log('Location ID:', locationId);

        if (!locationId) {
            return res.status(400).json({
                success: false,
                message: 'Location ID is required'
            });
        }

        await pool.execute(`
            DELETE FROM favorites 
            WHERE user_id = ? AND location_id = ?
        `, [userId, locationId]);

        console.log('Successfully removed from favorites');

        res.json({ success: true, message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ 
            success: false, 
            message: `Error removing from favorites: ${error.message}`
        });
    }
});

module.exports = router; 