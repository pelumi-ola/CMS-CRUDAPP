const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    body: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    image: { type: String, default: '' }, // URL or /uploads/<filename>
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

postSchema.pre('validate', function generateSlug(next) {
  if (this.title && (this.isModified('title') || !this.slug)) {
    const base = slugify(this.title, { lower: true, strict: true });
    this.slug = `${base}-${Date.now().toString(36)}`;
  }
  next();
});

postSchema.pre('save', function setPublishedAt(next) {
  if (this.isModified('status')) {
    if (this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    if (this.status === 'draft') {
      this.publishedAt = undefined;
    }
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
