import React, { useState, useEffect } from 'react';
import { createCompany, updateCompany } from '../services/api';
import './CompanyForm.css';


const CompanyForm = ({ company, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    foundedYear: '',
    website: '',
    email: '',
    phone: '',
    description: '',
    employees: '',
    revenue: {
      amount: '',
      currency: 'USD'
    },
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Real Estate', 'Transportation', 'Entertainment', 
    'Food & Beverage', 'Energy', 'Consulting', 'Other'
  ];

  const sizes = [
    'Startup (1-10)',
    'Small (11-50)',
    'Medium (51-200)',
    'Large (201-1000)',
    'Enterprise (1000+)'
  ];

  const currencies = ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD'];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        size: company.size || '',
        location: {
          city: company.location?.city || '',
          state: company.location?.state || '',
          country: company.location?.country || 'India'
        },
        foundedYear: company.foundedYear || '',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        description: company.description || '',
        employees: company.employees || '',
        revenue: {
          amount: company.revenue?.amount || '',
          currency: company.revenue?.currency || 'USD'
        },
        tags: company.tags || []
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    if (!formData.location.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.location.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
      newErrors.foundedYear = 'Please enter a valid founding year';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.employees && (formData.employees < 1 || formData.employees > 10000000)) {
      newErrors.employees = 'Please enter a valid number of employees';
    }

    if (formData.revenue.amount && formData.revenue.amount < 0) {
      newErrors.revenue = 'Revenue cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = string.startsWith('http') ? string : `https://${string}`;
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name] || errors[name.split('.')[1]]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        [name.split('.')[1]]: ''
      }));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Clean up data before sending
      const cleanData = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
        employees: formData.employees ? parseInt(formData.employees) : undefined,
        revenue: {
          amount: formData.revenue.amount ? parseFloat(formData.revenue.amount) : undefined,
          currency: formData.revenue.currency
        }
      };

      // Remove empty fields
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === '' || cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });

      if (company) {
        await updateCompany(company._id, cleanData);
      } else {
        await createCompany(cleanData);
      }

      onSubmit();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-form">
      <div className="form-header">
        <h2>{company ? 'Edit Company' : 'Add New Company'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-body">
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Company Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Enter company name"
                required
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="industry">Industry *</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`form-control ${errors.industry ? 'error' : ''}`}
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && <div className="form-error">{errors.industry}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="size">Company Size *</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={`form-control ${errors.size ? 'error' : ''}`}
                  required
                >
                  <option value="">Select Size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <div className="form-error">{errors.size}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Brief description of the company"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3>Location</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location.city">City *</label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className={`form-control ${errors.city ? 'error' : ''}`}
                  placeholder="Enter city"
                  required
                />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="location.state">State *</label>
                <select
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className={`form-control ${errors.state ? 'error' : ''}`}
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <div className="form-error">{errors.state}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="location.country">Country</label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="form-section">
            <h3>Additional Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="foundedYear">Founded Year</label>
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  className={`form-control ${errors.foundedYear ? 'error' : ''}`}
                  placeholder="YYYY"
                  min="1800"
                  max={new Date().getFullYear()}
                />
                {errors.foundedYear && <div className="form-error">{errors.foundedYear}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="employees">Number of Employees</label>
                <input
                  type="number"
                  id="employees"
                  name="employees"
                  value={formData.employees}
                  onChange={handleInputChange}
                  className={`form-control ${errors.employees ? 'error' : ''}`}
                  placeholder="e.g., 100"
                  min="1"
                />
                {errors.employees && <div className="form-error">{errors.employees}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`form-control ${errors.website ? 'error' : ''}`}
                  placeholder="https://example.com"
                />
                {errors.website && <div className="form-error">{errors.website}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="contact@company.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="+91 12345 67890"
                />
              </div>
            </div>

            {/* Revenue */}
            <div className="form-group">
              <label>Annual Revenue</label>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <input
                    type="number"
                    name="revenue.amount"
                    value={formData.revenue.amount}
                    onChange={handleInputChange}
                    className={`form-control ${errors.revenue ? 'error' : ''}`}
                    placeholder="1000000"
                    min="0"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <select
                    name="revenue.currency"
                    value={formData.revenue.currency}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.revenue && <div className="form-error">{errors.revenue}</div>}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagAdd}
                className="form-control"
                placeholder="Type a tag and press Enter"
              />
              <div className="tags-container">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (company ? 'Update Company' : 'Create Company')}
          </button>
        </div>
      </form>

      
    </div>
  );
};

export default CompanyForm;