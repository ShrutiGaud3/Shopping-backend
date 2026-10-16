const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to store newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let subscriber = await Subscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our ethnic wear newsletter!'
        });
      } else {
        subscriber.status = 'active';
        subscriber.subscribedAt = new Date();
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.'
        });
      }
    }

    subscriber = new Subscriber({
      email: cleanEmail,
      source: source || 'Footer Signup',
      status: 'active'
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will receive exclusive festive offers and saree launches.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all newsletter subscribers for Admin
// @route   GET /api/admin/subscribers
// @access  Private/Admin
const getAdminSubscribers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Subscriber.countDocuments(filter);

    const subscribers = await Subscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const [activeCount, unsubscribedCount, totalCount] = await Promise.all([
      Subscriber.countDocuments({ status: 'active' }),
      Subscriber.countDocuments({ status: 'unsubscribed' }),
      Subscriber.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      counts: {
        active: activeCount,
        unsubscribed: unsubscribedCount,
        all: totalCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export subscribers as CSV
// @route   GET /api/admin/subscribers/export
// @access  Private/Admin
const exportSubscribersCSV = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    let csv = 'Email,Status,Source,Date Subscribed\n';
    subscribers.forEach((s) => {
      const dateStr = s.createdAt ? new Date(s.createdAt).toISOString() : '';
      csv += `"${s.email}","${s.status}","${s.source || ''}","${dateStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/admin/subscribers/:id
// @access  Private/Admin
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    await Subscriber.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  subscribeNewsletter,
  getAdminSubscribers,
  exportSubscribersCSV,
  deleteSubscriber
};
