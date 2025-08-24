const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// GET /api/companies - Get all companies with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      size,
      city,
      state,
      country,
      foundedYear,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    if (industry) filter.industry = industry;
    if (size) filter.size = size;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (foundedYear) filter.foundedYear = parseInt(foundedYear);

    // Text search
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const companies = await Company.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Company.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
});

// GET /api/companies/stats - Get company statistics
router.get('/stats', async (req, res) => {
  try {
    const [industryStats, sizeStats, locationStats, totalCompanies] = await Promise.all([
      Company.getIndustryStats(),
      Company.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$size', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Company.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location.country', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Company.countDocuments({ isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCompanies,
        industryDistribution: industryStats,
        sizeDistribution: sizeStats,
        locationDistribution: locationStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// GET /api/companies/:id - Get single company
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || !company.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message
    });
  }
});

// POST /api/companies - Create new company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message
    });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || !company.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        company[key] = req.body[key];
      }
    });

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating company',
      error: error.message
    });
  }
});

// DELETE /api/companies/:id - Soft delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || !company.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    company.isActive = false;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: error.message
    });
  }
});

// POST /api/companies/bulk - Bulk create companies
router.post('/bulk', async (req, res) => {
  try {
    const { companies } = req.body;

    if (!Array.isArray(companies) || companies.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of companies'
      });
    }

    const createdCompanies = await Company.insertMany(companies, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${createdCompanies.length} companies created successfully`,
      data: createdCompanies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating companies',
      error: error.message
    });
  }
});

module.exports = router;