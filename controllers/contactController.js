const Contact = require('../models/Contact');
const { sendConfirmationEmail } = require('../utils/sendEmail');

// @desc    Submit customer contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, orderNumber, topic, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Message)'
      });
    }

    const contactMsg = new Contact({
      name,
      email,
      orderNumber: orderNumber || '',
      topic: topic || 'Order Inquiry',
      message
    });

    const savedMsg = await contactMsg.save();

    // Send confirmation email notification to customer
    const ticketId = savedMsg._id.toString().slice(-6).toUpperCase();
    await sendConfirmationEmail({
      name,
      email,
      topic: topic || 'Order Inquiry',
      message,
      ticketId
    });

    res.status(201).json({
      success: true,
      message: `Inquiry #${ticketId} submitted! Confirmation sent to ${email}. Our concierge team will respond within 24 hours.`,
      data: savedMsg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error while submitting message'
    });
  }
};

// @desc    Get all contact messages (Admin Only)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact message status (Admin Only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: msg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  updateContactStatus
};
