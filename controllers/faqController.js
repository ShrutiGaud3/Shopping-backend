const Faq = require('../models/Faq');

const defaultFaqs = [
  {
    question: 'How do I place an order for custom stitched blouses or lehengas?',
    answer: 'You can order directly online selecting standard sizing, or click the "Order on WhatsApp" button on any product page to send your custom measurements directly to our master tailors.',
    category: 'Sizing & Customization',
    order: 1,
    isActive: true
  },
  {
    question: 'How long does domestic shipping take across India?',
    answer: 'Orders are dispatched within 24 to 48 hours. Metro cities receive delivery in 3 to 4 business days; rest of India takes 4 to 6 business days.',
    category: 'Shipping & Delivery',
    order: 2,
    isActive: true
  },
  {
    question: 'What is your 10-Day Exchange policy?',
    answer: 'We provide an easy 10-day exchange window for all unworn, unwashed items with original tags intact. Simply visit "My Orders" and click "Request Exchange".',
    category: 'Returns & Exchange',
    order: 3,
    isActive: true
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes! Cash on Delivery is available across all serviceable pincodes in India for orders up to ₹10,000.',
    category: 'Orders & Payment',
    order: 4,
    isActive: true
  },
  {
    question: 'Do you offer worldwide international shipping?',
    answer: 'Yes, we ship to over 120 countries worldwide including the USA, UK, Canada, Australia, and UAE via DHL Express.',
    category: 'Shipping & Delivery',
    order: 5,
    isActive: true
  }
];

// @desc    Get all active FAQs (Public)
// @route   GET /api/faqs
// @access  Public
const getFaqs = async (req, res) => {
  try {
    let faqs = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    if (faqs.length === 0) {
      await Faq.insertMany(defaultFaqs);
      faqs = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    }
    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/faqs/all
// @access  Private/Admin
const getAllFaqsAdmin = async (req, res) => {
  try {
    let faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
    if (faqs.length === 0) {
      await Faq.insertMany(defaultFaqs);
      faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
    }
    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFaqs,
  getAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq
};
