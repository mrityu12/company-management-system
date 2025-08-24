import React, { useState, useEffect } from 'react';
import './FilterControls.css';


const FilterControls = ({ filters, onFilterChange, stats }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      industry: '',
      size: '',
      location: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  const getFilterCount = () => {
    return Object.values(localFilters).filter(value => value !== '').length;
  };

  return (
    <div className="filter-controls">
      <div className="filter-header">
        <div className="filter-title">
          <h4>🔍 Filters</h4>
          {hasActiveFilters && (
            <span className="filter-badge">{getFilterCount()}</span>
          )}
        </div>
        
        <div className="filter-actions">
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              className="btn-clear"
              title="Clear all filters"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle"
            title={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <div className={`filter-body ${isExpanded ? 'expanded' : ''}`}>
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="filter-input"
            placeholder="Search companies..."
          />
        </div>

        {/* Industry Filter */}
        <div className="filter-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={localFilters.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="filter-input"
          >
            <option value="">All Industries</option>
            {industries.map(industry => {
              const count = stats?.industryDistribution?.find(
                item => item._id === industry
              )?.count || 0;
              
              return (
                <option key={industry} value={industry}>
                  {industry} {count > 0 && `(${count})`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Size Filter */}
        <div className="filter-group">
          <label htmlFor="size">Company Size</label>
          <select
            id="size"
            value={localFilters.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            className="filter-input"
          >
            <option value="">All Sizes</option>
            {sizes.map(size => {
              const count = stats?.sizeDistribution?.find(
                item => item._id === size
              )?.count || 0;
              
              return (
                <option key={size} value={size}>
                  {size} {count > 0 && `(${count})`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={localFilters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="filter-input"
            placeholder="City or State..."
          />
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <span className="quick-filter-label">Quick Filters:</span>
          <div className="quick-filter-buttons">
            <button
              onClick={() => handleInputChange('industry', 'Technology')}
              className={`quick-filter-btn ${localFilters.industry === 'Technology' ? 'active' : ''}`}
            >
              Tech
            </button>
            <button
              onClick={() => handleInputChange('size', 'Startup (1-10)')}
              className={`quick-filter-btn ${localFilters.size === 'Startup (1-10)' ? 'active' : ''}`}
            >
              Startups
            </button>
            <button
              onClick={() => handleInputChange('size', 'Enterprise (1000+)')}
              className={`quick-filter-btn ${localFilters.size === 'Enterprise (1000+)' ? 'active' : ''}`}
            >
              Enterprise
            </button>
            <button
              onClick={() => handleInputChange('location', 'Bangalore')}
              className={`quick-filter-btn ${localFilters.location === 'Bangalore' ? 'active' : ''}`}
            >
              Bangalore
            </button>
            <button
              onClick={() => handleInputChange('location', 'Mumbai')}
              className={`quick-filter-btn ${localFilters.location === 'Mumbai' ? 'active' : ''}`}
            >
              Mumbai
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="filter-summary">
            <h5>Active Filters:</h5>
            <div className="active-filters">
              {localFilters.search && (
                <span className="active-filter">
                  Search: "{localFilters.search}"
                  <button 
                    onClick={() => handleInputChange('search', '')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.industry && (
                <span className="active-filter">
                  Industry: {localFilters.industry}
                  <button 
                    onClick={() => handleInputChange('industry', '')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.size && (
                <span className="active-filter">
                  Size: {localFilters.size}
                  <button 
                    onClick={() => handleInputChange('size', '')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.location && (
                <span className="active-filter">
                  Location: {localFilters.location}
                  <button 
                    onClick={() => handleInputChange('location', '')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default FilterControls;