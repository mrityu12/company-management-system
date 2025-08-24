import React from 'react';
import './CompanyCard.css';


const CompanyCard = ({ company, onEdit, onDelete }) => {
  const formatRevenue = (revenue) => {
    if (!revenue || !revenue.amount) return null;
    
    const amount = revenue.amount;
    const currency = revenue.currency || 'USD';
    
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency} ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${currency} ${amount}`;
    }
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': '#667eea',
      'Healthcare': '#28a745',
      'Finance': '#ffc107',
      'Education': '#17a2b8',
      'Manufacturing': '#6f42c1',
      'Retail': '#e83e8c',
      'Real Estate': '#20c997',
      'Transportation': '#fd7e14',
      'Entertainment': '#dc3545',
      'Food & Beverage': '#198754',
      'Energy': '#6610f2',
      'Consulting': '#0d6efd',
      'Other': '#6c757d'
    };
    return colors[industry] || '#6c757d';
  };

  return (
    <div className="company-card">
      <div className="card-header">
        <div className="company-header">
          <h3 className="company-name">{company.name}</h3>
          <div className="company-actions">
            <button
              onClick={() => onEdit(company)}
              className="btn btn-sm btn-secondary"
              title="Edit Company"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(company._id)}
              className="btn btn-sm btn-danger"
              title="Delete Company"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className="company-meta">
          <span 
            className="industry-tag"
            style={{ backgroundColor: getIndustryColor(company.industry) }}
          >
            {company.industry}
          </span>
          <span className="size-badge">{company.size}</span>
        </div>
      </div>

      <div className="card-body">
        {company.description && (
          <p className="company-description">
            {company.description.length > 120 
              ? `${company.description.substring(0, 120)}...` 
              : company.description
            }
          </p>
        )}

        <div className="company-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">
              {company.location.city}, {company.location.state}
              {company.location.country !== 'India' && `, ${company.location.country}`}
            </span>
          </div>

          {company.foundedYear && (
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span className="detail-text">
                Founded {company.foundedYear} 
                {company.companyAge && ` (${company.companyAge} years)`}
              </span>
            </div>
          )}

          {company.employees && (
            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <span className="detail-text">{company.employees} employees</span>
            </div>
          )}

          {company.revenue && company.revenue.amount && (
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <span className="detail-text">Revenue: {formatRevenue(company.revenue)}</span>
            </div>
          )}

          {company.website && (
            <div className="detail-item">
              <span className="detail-icon">🌐</span>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="detail-link"
              >
                Visit Website
              </a>
            </div>
          )}

          {company.email && (
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <a 
                href={`mailto:${company.email}`}
                className="detail-link"
              >
                {company.email}
              </a>
            </div>
          )}

          {company.phone && (
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <a 
                href={`tel:${company.phone}`}
                className="detail-link"
              >
                {company.phone}
              </a>
            </div>
          )}
        </div>

        {company.tags && company.tags.length > 0 && (
          <div className="company-tags">
            {company.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <small className="text-muted">
            {company.updatedAt ? (
              `Updated ${new Date(company.updatedAt).toLocaleDateString()}`
            ) : company.createdAt ? (
              `Created ${new Date(company.createdAt).toLocaleDateString()}`
            ) : ''}
          </small>
        </div>
      </div>

    
    </div>
  );
};

export default CompanyCard;