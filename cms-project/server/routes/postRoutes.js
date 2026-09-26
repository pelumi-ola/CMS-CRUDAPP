const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

// --- File upload setup (stores images locally under /uploads) ---
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|gif|webp)/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

// @route   POST /api/posts/upload
// @desc    Upload a single image, returns its public URL
// @access  Private
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// @route   GET /api/posts
// @desc    List posts. Public callers only see published posts.
//          Authenticated callers can pass status=draft|published|all and see everything.
// @query   page, limit, category, search, status
// @access  Public / Private (behavior varies)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const filter = {};

    // Determine visibility: try to read a token without hard-requiring one
    let isAuthed = false;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        isAuthed = true;
      } catch (_) {
        isAuthed = false;
      }
    }

    if (!isAuthed) {
      filter.status = 'published';
    } else if (status && status !== 'all') {
      filter.status = status;
    }

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/posts/:idOrSlug
// @access  Public (published only) / Private (any status)
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const post = await Post.findOne(query).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.status !== 'published') {
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(404).json({ message: 'Post not found' });
      }
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      } catch (_) {
        return res.status(404).json({ message: 'Post not found' });
      }
    }

    res.json({ post });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, body, excerpt, image, category, status } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const post = await Post.create({
      title,
      body,
      excerpt,
      image,
      category,
      status: status === 'published' ? 'published' : 'draft',
      author: req.user._id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { title, body, excerpt, image, category, status } = req.body;
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (image !== undefined) post.image = image;
    if (category !== undefined) post.category = category;
    if (status !== undefined) post.status = status;

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
