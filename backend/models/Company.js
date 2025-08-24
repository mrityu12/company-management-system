// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
      enum: [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Manufacturing',
        'Retail',
        'Real Estate',
        'Transportation',
        'Entertainment',
        'Food & Beverage',
        'Energy',
        'Consulting',
        'Other',
      ],
    },
    size: {
      type: String,
      required: [true, 'Company size is required'],
      enum: [
        'Startup (1-10)',
        'Small (11-50)',
        'Medium (51-200)',
        'Large (201-1000)',
        'Enterprise (1000+)',
      ],
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'India',
      },
    },
    foundedYear: {
      type: Number,
      min: [1800, 'Founded year cannot be before 1800'],
      max: [new Date().getFullYear(), `Founded year cannot be in the future`],
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty website
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(
            v
          );
        },
        message: 'Please enter a valid website URL',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty email
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty phone
          return /^[+]?[0-9]{7,15}$/.test(v);
        },
        message: 'Please enter a valid phone number',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    employees: {
      type: Number,
      min: [1, 'Employee count must be at least 1'],
    },
    revenue: {
      amount: {
        type: Number,
        min: [0, 'Revenue cannot be negative'],
      },
      currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD'],
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Auto: createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 📌 Indexes for better query performance
companySchema.index({ name: 'text', description: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ 'location.city': 1, 'location.state': 1 });
companySchema.index({ foundedYear: 1 });
companySchema.index({ isActive: 1 });

// 📌 Virtual for full location
companySchema.virtual('fullLocation').get(function () {
  return `${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// 📌 Virtual for company age
companySchema.virtual('companyAge').get(function () {
  if (this.foundedYear) {
    return new Date().getFullYear() - this.foundedYear;
  }
  return null;
});

// 📌 Pre-save middleware
companySchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  if (this.website && !this.website.startsWith('http')) {
    this.website = 'https://' + this.website;
  }
  next();
});

// 📌 Static methods
companySchema.statics.findByIndustry = function (industry) {
  return this.find({ industry, isActive: true });
};

companySchema.statics.findByLocation = function (city, state) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    isActive: true,
  });
};

companySchema.statics.getIndustryStats = function () {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model('Company', companySchema);
