const ShippingZone = require('../models/ShippingZone');

// Seed default shipping zones if none exist
const seedDefaultShippingZones = async () => {
  try {
    const count = await ShippingZone.countDocuments();
    if (count === 0) {
      await ShippingZone.create([
        {
          country: 'India',
          countryCode: 'IN',
          charge: 99,
          freeAbove: 999,
          estimatedDays: '3-5 Business Days',
          isActive: true
        },
        {
          country: 'United States',
          countryCode: 'US',
          charge: 1999,
          freeAbove: 9999,
          estimatedDays: '5-7 Business Days',
          isActive: true
        },
        {
          country: 'United Kingdom',
          countryCode: 'GB',
          charge: 1899,
          freeAbove: 9999,
          estimatedDays: '5-7 Business Days',
          isActive: true
        },
        {
          country: 'United Arab Emirates',
          countryCode: 'AE',
          charge: 1499,
          freeAbove: 7999,
          estimatedDays: '3-5 Business Days',
          isActive: true
        },
        {
          country: 'Canada',
          countryCode: 'CA',
          charge: 2099,
          freeAbove: 9999,
          estimatedDays: '5-8 Business Days',
          isActive: true
        },
        {
          country: 'Australia',
          countryCode: 'AU',
          charge: 2199,
          freeAbove: 10999,
          estimatedDays: '6-9 Business Days',
          isActive: true
        }
      ]);
      console.log('[Shipping Zones] Default country shipping rates seeded.');
    }
  } catch (err) {
    console.error('[Shipping Zones] Seed error:', err.message);
  }
};

seedDefaultShippingZones();

// @desc    Get all active shipping zones (Public for checkout)
// @route   GET /api/shipping-zones
// @access  Public
const getShippingZones = async (req, res) => {
  try {
    const zones = await ShippingZone.find({ isActive: true }).sort({ country: 1 });
    res.status(200).json({
      success: true,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all shipping zones including inactive (Admin)
// @route   GET /api/shipping-zones/admin
// @access  Private/Admin
const getAllShippingZonesAdmin = async (req, res) => {
  try {
    const zones = await ShippingZone.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new shipping zone (Admin)
// @route   POST /api/shipping-zones
// @access  Private/Admin
const createShippingZone = async (req, res) => {
  try {
    const { country, countryCode, charge, freeAbove, estimatedDays, isActive } = req.body;

    if (!country || charge === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Country name and shipping charge are required'
      });
    }

    const existing = await ShippingZone.findOne({ country: new RegExp(`^${country.trim()}$`, 'i') });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Shipping zone for '${country}' already exists`
      });
    }

    const newZone = new ShippingZone({
      country: country.trim(),
      countryCode: (countryCode || 'IN').trim().toUpperCase(),
      charge: Number(charge),
      freeAbove: Number(freeAbove || 0),
      estimatedDays: estimatedDays || '3-5 Business Days',
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    const saved = await newZone.save();
    res.status(201).json({
      success: true,
      message: `Shipping zone for ${saved.country} created`,
      data: saved
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shipping zone (Admin)
// @route   PUT /api/shipping-zones/:id
// @access  Private/Admin
const updateShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Shipping zone not found'
      });
    }

    Object.assign(zone, req.body);
    const updated = await zone.save();

    res.status(200).json({
      success: true,
      message: `Shipping zone for ${updated.country} updated`,
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete shipping zone (Admin)
// @route   DELETE /api/shipping-zones/:id
// @access  Private/Admin
const deleteShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Shipping zone not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Shipping zone '${zone.country}' deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getShippingZones,
  getAllShippingZonesAdmin,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone
};
