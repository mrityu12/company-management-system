import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred');
    }
  }
);

// Company API functions
export const getAllCompanies = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  const url = queryString ? `/companies?${queryString}` : '/companies';
  
  return await api.get(url);
};

export const getCompanyById = async (id) => {
  return await api.get(`/companies/${id}`);
};

export const createCompany = async (companyData) => {
  return await api.post('/companies', companyData);
};

export const updateCompany = async (id, companyData) => {
  return await api.put(`/companies/${id}`, companyData);
};

export const deleteCompany = async (id) => {
  return await api.delete(`/companies/${id}`);
};

export const getCompanyStats = async () => {
  return await api.get('/companies/stats');
};

export const bulkCreateCompanies = async (companies) => {
  return await api.post('/companies/bulk', { companies });
};

// Utility functions
export const searchCompanies = async (searchTerm, filters = {}) => {
  return await getAllCompanies({
    search: searchTerm,
    ...filters
  });
};

export const getCompaniesByIndustry = async (industry) => {
  return await getAllCompanies({ industry });
};

export const getCompaniesByLocation = async (city, state) => {
  return await getAllCompanies({ city, state });
};

export const getCompaniesBySize = async (size) => {
  return await getAllCompanies({ size });
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

// Export axios instance for custom requests
export default api;