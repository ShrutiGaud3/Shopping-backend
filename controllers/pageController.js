const Page = require('../models/Page');

const defaultPages = [
  {
    title: 'About Us',
    slug: 'about-us',
    content: `<h2>Welcome to Weavera Fashion</h2>
<p>Weavera is dedicated to celebrating the timeless elegance of Indian craftsmanship. We blend centuries-old weaving traditions with contemporary silhouettes to design sarees, bridal lehengas, festive anarkalis, and occasion wear that make you shine on your most cherished moments.</p>
<h3>Our Commitment to Craft</h3>
<p>Every piece at Weavera is designed with meticulous attention to detail, using pure silks, georgettes, velvets, and hand-embroidered zari work sourced from master artisans across Gujarat and Rajasthan.</p>`,
    metaTitle: 'About Us | Weavera Luxury Ethnic Couture',
    metaDescription: 'Learn about Weavera, our heritage craftsmanship, and our journey to global wardrobes.',
    isActive: true
  },
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    content: `<h2>Shipping & Delivery Information</h2>
<p>We provide reliable worldwide shipping and expedited domestic delivery across all 28,000+ Indian pincodes.</p>
<ul>
  <li><strong>Domestic Delivery:</strong> 3 to 6 business days via Bluedart / Delhivery / DTDC.</li>
  <li><strong>Free Shipping:</strong> Automatically applied to all orders above ₹999 across India.</li>
  <li><strong>Cash on Delivery (COD):</strong> Available on orders up to ₹10,000 with a standard verification process.</li>
  <li><strong>International Shipping:</strong> Delivered in 7 to 12 business days via DHL Express / FedEx.</li>
</ul>`,
    metaTitle: 'Shipping & Delivery Policy | Weavera',
    metaDescription: 'Transparent domestic & international shipping timelines and free shipping terms.',
    isActive: true
  },
  {
    title: 'Refund & 10-Day Exchange Policy',
    slug: 'refund-policy',
    content: `<h2>10-Days Hassle-Free Exchange & Return Policy</h2>
<p>At Weavera, your satisfaction is our foremost priority. If you encounter any sizing issues, color discrepancies, or manufacturing defects, we offer a seamless <strong>10-Day Exchange Window</strong> from the date of confirmed delivery.</p>
<h3>How to Request an Exchange:</h3>
<ol>
  <li>Log in to your Weavera account and navigate to <strong>My Orders</strong>.</li>
  <li>Click on the <strong>Request Exchange</strong> button next to your delivered order.</li>
  <li>Select your preferred size or replacement reason and submit your request.</li>
  <li>Our logistics team will arrange reverse pickup within 48 business hours.</li>
</ol>`,
    metaTitle: 'Refund & Exchange Policy | Weavera',
    metaDescription: 'Read about our 10-days easy exchange policy and quick customer support process.',
    isActive: true
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    content: `<h2>Terms of Service</h2>
<p>By accessing or purchasing from Weavera, you agree to comply with our commercial terms, privacy standards, and fair usage policies. All product imagery and designs are exclusive intellectual property of Weavera Fashion Hub.</p>`,
    metaTitle: 'Terms & Conditions | Weavera',
    metaDescription: 'Terms of service and legal agreement for shopping on Weavera.',
    isActive: true
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `<h2>Privacy & Data Security</h2>
<p>We value your trust and are committed to protecting your personal data. We use 256-bit bank-grade encryption to safeguard your checkout information and do not share customer contact details with third-party marketers.</p>`,
    metaTitle: 'Privacy Policy | Weavera',
    metaDescription: 'Our commitment to protecting your privacy and security.',
    isActive: true
  }
];

// @desc    Get all active pages list (Public)
// @route   GET /api/pages
// @access  Public
const getPages = async (req, res) => {
  try {
    let pages = await Page.find({ isActive: true }).select('title slug updatedAt');
    if (pages.length === 0) {
      await Page.insertMany(defaultPages);
      pages = await Page.find({ isActive: true }).select('title slug updatedAt');
    }
    res.status(200).json({
      success: true,
      data: pages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pages for Admin
// @route   GET /api/pages/all
// @access  Private/Admin
const getAllPagesAdmin = async (req, res) => {
  try {
    let pages = await Page.find().sort({ updatedAt: -1 });
    if (pages.length === 0) {
      await Page.insertMany(defaultPages);
      pages = await Page.find().sort({ updatedAt: -1 });
    }
    res.status(200).json({
      success: true,
      data: pages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = async (req, res) => {
  try {
    let page = await Page.findOne({ slug: req.params.slug.toLowerCase() });
    if (!page) {
      // Check if it's one of the default pages to auto-create
      const matchedDefault = defaultPages.find((p) => p.slug === req.params.slug.toLowerCase());
      if (matchedDefault) {
        page = await Page.create(matchedDefault);
      } else {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
    }
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new page (Admin)
// @route   POST /api/pages
// @access  Private/Admin
const createPage = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const page = await Page.create(payload);
    res.status(201).json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update page (Admin)
// @route   PUT /api/pages/:id
// @access  Private/Admin
const updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete page (Admin)
// @route   DELETE /api/pages/:id
// @access  Private/Admin
const deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPages,
  getAllPagesAdmin,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
};
