const BlogPost = require('../models/BlogPost');

// Initial seed articles if database has no blogs
const defaultEthnicBlogs = [
  {
    title: 'The Royal Guide to Choosing Authentic Surat Silk Sarees',
    slug: 'royal-guide-to-choosing-authentic-surat-silk-sarees',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Discover the heritage of Surat weavers, the hallmark of pure zari threads, and how to identify real handloom silks for weddings and festive galas.',
    category: 'Silk & Handlooms',
    tags: ['Surat Silk', 'Saree Guide', 'Handloom', 'Bridal Heritage'],
    readTime: '6 min read',
    isPublished: true,
    author: {
      name: 'Pooja Varma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      role: 'Master Textile Specialist'
    },
    content: `
      <h2>The Textile Legacy of Surat</h2>
      <p>Surat, often celebrated as the silk and textile capital of India, has been weaving tales of grandeur for over seven centuries. From royal Mughal courts to modern bridal catwalks, Surat handlooms represent the pinnacle of Indian textile craftsmanship.</p>

      <h3>How to Spot Genuine Surat Silk</h3>
      <p>When selecting a silk saree for a milestone celebration, understanding the purity of the weave makes all the difference:</p>
      <ul>
        <li><strong>Lustre and Texture:</strong> Pure Surat silk reflects light with multidirectional warmth rather than synthetic single-plane shine.</li>
        <li><strong>Zari Authenticity:</strong> Premium bridal sarees feature electroplated silver and gold-wrapped threads that feel supple rather than stiff or abrasive.</li>
        <li><strong>Pallu Reversibility:</strong> Traditional jacquard loom borders maintain clean reverse finishing with minimal exposed yarn knots.</li>
      </ul>

      <blockquote>"A handcrafted saree is not just an ensemble; it is an heirloom that carries memories through generations."</blockquote>

      <h3>Caring for Your Heirloom Silks</h3>
      <p>Always preserve your silk sarees wrapped in breathable cotton or muslin fabric. Avoid spraying perfumes directly onto zari borders, and air-dry in shaded breeze after celebrations before storing.</p>
    `,
    seo: {
      metaTitle: 'Guide to Authentic Surat Silk Sarees | SuratiKart Blog',
      metaDescription: 'Learn how to identify authentic Surat handloom silk sarees, zari purity, and styling tips for weddings and festivities.'
    }
  },
  {
    title: 'Bridal Lehenga Trends 2026: From Velvet Borders to Pastel Organza',
    slug: 'bridal-lehenga-trends-2026-velvet-borders-to-pastel-organza',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Explore the biggest bridal runway looks of this season featuring double dupattas, 3D floral threadwork, and bespoke unstitched lehenga styling.',
    category: 'Bridal Couture',
    tags: ['Bridal Lehenga', 'Wedding Fashion', 'Surat Couture', 'Trends 2026'],
    readTime: '5 min read',
    isPublished: true,
    author: {
      name: 'Aditi Shah',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Head of Ethnic Design'
    },
    content: `
      <h2>The Evolution of Modern Indian Bridal Wear</h2>
      <p>The 2026 wedding season celebrates a breathtaking balance between royal Rajasthani heritage and lightweight comfort. Brides are no longer willing to endure heavy, suffocating garments on their special day.</p>

      <h3>Key Trends Defining 2026 Brides</h3>
      <ol>
        <li><strong>Dual-Dupatta Styling:</strong> Pairing a heavy velvet or silk shoulder drape with a feather-light scalloped organza head veil.</li>
        <li><strong>Jewel Toned Resham:</strong> Deep wine, emerald forest, and heritage rani pink are making a triumphant resurgence alongside ivory gold.</li>
        <li><strong>Custom Micro-Can-Can Flare:</strong> Tailored kali flare construction that provides stunning 6-meter volume without cumbersome weight.</li>
      </ol>

      <p>With our custom semi-stitched lehenga sets, every bride can personalize waist fit, sleeve embroidery, and blouse necklines to perfection.</p>
    `,
    seo: {
      metaTitle: 'Bridal Lehenga Trends 2026 | VELORA Ethnic Wear',
      metaDescription: 'Discover the latest bridal lehenga trends for 2026: pastel organza, velvet borders, and royal Surat embroidery.'
    }
  },
  {
    title: '5 Ways to Style Anarkali Kurti Sets for Festive Family Gatherings',
    slug: '5-ways-to-style-anarkali-kurti-sets-festive-gatherings',
    coverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Effortless ethnic dressing ideas to transform your favourite floor-length anarkalis from daytime poojas to evening Sangeet celebrations.',
    category: 'Festive Styling',
    tags: ['Anarkali', 'Festive Wear', 'Styling Tips', 'Kurti Sets'],
    readTime: '4 min read',
    isPublished: true,
    author: {
      name: 'Kavita Mehta',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      role: 'Fashion Editor'
    },
    content: `
      <h2>The Timeless Charm of the Flared Anarkali</h2>
      <p>The flared silhouette of an Anarkali suit is universally flattering. Whether cut from fluid georgette, structured chanderi, or rich silk, it effortlessly transitions between celebratory occasions.</p>

      <h3>Styling Masterclass</h3>
      <p>Here are 5 insider styling tips to elevate your festive ensemble:</p>
      <ul>
        <li><strong>Statement Chandbalis:</strong> Skip neckpieces and let oversized Kundan earrings highlight your collarbone.</li>
        <li><strong>Cinched Waist Belt:</strong> Add an embroidered fabric belt or metallic waist chain for architectural definition.</li>
        <li><strong>Footwear Match:</strong> Hand-embroidered juttis or mojaris add authentic royal flair without the fatigue of stiletto heels.</li>
      </ul>
    `,
    seo: {
      metaTitle: '5 Ways to Style Anarkali Suits | Ethnic Styling Guide',
      metaDescription: 'Style your festive anarkalis with statement jewelry, belts, and dupattas for Indian celebrations.'
    }
  }
];

// Helper to seed default blogs if collection is empty
const ensureSeedBlogs = async () => {
  try {
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      await BlogPost.insertMany(defaultEthnicBlogs);
      console.log('Seeded default Surat ethnic fashion blog posts');
    }
  } catch (err) {
    console.error('Failed to seed default blogs:', err);
  }
};

// @desc    Get published blog posts with filtering, search & pagination
// @route   GET /api/blogs
// @access  Public
const getPublishedBlogs = async (req, res) => {
  try {
    await ensureSeedBlogs();

    const { tag, category, search, page = 1, limit = 9 } = req.query;
    const filter = { isPublished: true };

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await BlogPost.countDocuments(filter);

    const blogs = await BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get all unique tags for filter tabs
    const allTags = await BlogPost.distinct('tags', { isPublished: true });
    const allCategories = await BlogPost.distinct('category', { isPublished: true });

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      tags: allTags,
      categories: allCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single blog post by slug with related posts
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug, isPublished: true });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count asynchronously
    BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

    // Fetch up to 3 related posts
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      isPublished: true,
      $or: [
        { tags: { $in: post.tags || [] } },
        { category: post.category }
      ]
    }).limit(3);

    res.status(200).json({
      success: true,
      data: post,
      relatedPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all blog posts for Admin Panel
// @route   GET /api/blogs/admin/all or GET /api/admin/blogs
// @access  Private/Admin
const getAdminBlogs = async (req, res) => {
  try {
    await ensureSeedBlogs();

    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await BlogPost.countDocuments(filter);

    const blogs = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single blog post by ID for Admin editing
// @route   GET /api/blogs/admin/:id
// @access  Private/Admin
const getAdminBlogById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs or POST /api/admin/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      coverImage,
      excerpt,
      content,
      tags,
      category,
      author,
      readTime,
      isPublished,
      seo
    } = req.body;

    if (!title || !coverImage || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Title, cover image, excerpt, and content are required'
      });
    }

    // Process slug
    let finalSlug = slug;
    if (!finalSlug || !finalSlug.trim()) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Ensure unique slug
    const existing = await BlogPost.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const post = new BlogPost({
      title,
      slug: finalSlug,
      coverImage,
      excerpt,
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      category: category || 'Ethnic Fashion & Heritage',
      author: author || {
        name: req.user?.name || 'SuratiKart Style Team',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        role: 'Senior Fashion & Handloom Curator'
      },
      readTime: readTime || '5 min read',
      isPublished: isPublished !== undefined ? isPublished : true,
      seo: seo || { metaTitle: title, metaDescription: excerpt }
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update existing blog post
// @route   PUT /api/blogs/:id or PUT /api/admin/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const updates = { ...req.body };
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updated = await BlogPost.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id or DELETE /api/admin/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPublishedBlogs,
  getBlogBySlug,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
