const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route to fetch settings
router.get('/', getSettings);

// Admin route to update settings
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;
