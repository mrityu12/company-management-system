import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';
import FilterControls from './components/FilterControls';
import { getAllCompanies, getCompanyStats } from './services/api';

function App() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    size: '',
    location: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // useCallback lagaya taaki functions stable rahe
  const fetchCompanies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllCompanies({
        page,
        limit: pagination.itemsPerPage,
        ...filters
      });
      
      setCompanies(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch companies. Please try again.');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.itemsPerPage]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getCompanyStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...companies];

    if (filters.search) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        company.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.industry) {
      filtered = filtered.filter(company => company.industry === filters.industry);
    }

    if (filters.size) {
      filtered = filtered.filter(company => company.size === filters.size);
    }

    if (filters.location) {
      filtered = filtered.filter(company =>
        company.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        company.location.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, filters]);

  // ab dependency properly diye gaye hain
  useEffect(() => {
    fetchCompanies();
    fetchStats();
  }, [fetchCompanies, fetchStats]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        // You would implement deleteCompany in api.js
        // await deleteCompany(companyId);
        await fetchCompanies(pagination.currentPage);
        await fetchStats();
      } catch (err) {
        setError('Failed to delete company. Please try again.');
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingCompany(null);
    await fetchCompanies(pagination.currentPage);
    await fetchStats();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handlePageChange = (page) => {
    fetchCompanies(page);
  };

  if (loading && companies.length === 0) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🏢 Company Management System</h1>
          <p>Manage and explore company data with advanced filtering</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="alert alert-error">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="alert-close">×</button>
            </div>
          )}

          {/* Statistics Dashboard */}
          {stats && (
            <div className="stats-dashboard">
              <div className="stat-card">
                <h3>Total Companies</h3>
                <p className="stat-number">{stats.totalCompanies}</p>
              </div>
              <div className="stat-card">
                <h3>Industries</h3>
                <p className="stat-number">{stats.industryDistribution?.length || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Countries</h3>
                <p className="stat-number">{stats.locationDistribution?.length || 0}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="controls-section">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              stats={stats}
            />
            <button 
              className="btn btn-primary add-company-btn"
              onClick={handleAddCompany}
            >
              + Add New Company
            </button>
          </div>

          {/* Company Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <CompanyForm
                  company={editingCompany}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            </div>
          )}

          {/* Company List */}
          <CompanyList
            companies={filteredCompanies}
            loading={loading}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Company Management System. Built with React & Node.js 🩷 Mrityunjay Kumar</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
