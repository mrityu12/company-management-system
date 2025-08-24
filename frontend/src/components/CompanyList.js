import React, { useState } from 'react';
import CompanyCard from './CompanyCard';
import './CompanyList.css';


const CompanyList = ({ 
  companies, 
  loading, 
  onEdit, 
  onDelete, 
  pagination, 
  onPageChange 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading companies...</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Companies Found</h3>
          <p>Try adjusting your filters or add a new company to get started.</p>
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const { currentPage, totalPages } = pagination;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="pagination-btn"
      >
        ← Previous
      </button>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - 1 && i <= currentPage + 1) // Current page ± 1
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(<span key={`ellipsis-${i}`}>...</span>);
      }
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="pagination-btn"
      >
        Next →
      </button>
    );

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  };

  const renderGridView = () => (
    <div className="companies-grid">
      {companies.map(company => (
        <CompanyCard
          key={company._id}
          company={company}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Size</th>
            <th>Location</th>
            <th>Founded</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company._id}>
              <td>
                <div>
                  <strong>{company.name}</strong>
                  {company.description && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      {company.description.length > 60 
                        ? `${company.description.substring(0, 60)}...` 
                        : company.description
                      }
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span className="tag tag-primary">{company.industry}</span>
              </td>
              <td>
                <span className="tag">{company.size}</span>
              </td>
              <td>
                {company.location.city}, {company.location.state}
              </td>
              <td>
                {company.foundedYear || 'N/A'}
              </td>
              <td>
                {company.website ? (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#667eea' }}
                  >
                    Visit
                  </a>
                ) : 'N/A'}
              </td>
              <td>
                <div className="btn-group">
                  <button
                    onClick={() => onEdit(company)}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(company._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="company-list">
      {/* Header with view mode toggle and results info */}
      <div className="list-header">
        <div className="results-info">
          <h3>Companies</h3>
          <p>
            Showing {companies.length} of {pagination.totalItems} companies
            {pagination.currentPage > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
          </p>
        </div>
        
        <div className="view-controls">
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📋 Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📊 Table
          </button>
        </div>
      </div>

      {/* Company List */}
      {viewMode === 'grid' ? renderGridView() : renderTableView()}

      {/* Pagination */}
      {renderPagination()}

      
    </div>
  );
};

export default CompanyList;