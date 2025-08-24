# 🏢 Company Management System

A full-stack web application for managing company data with advanced filtering, search capabilities, and a modern user interface.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with full CRUD operations
- **Advanced Filtering** by industry, size, location, and more
- **Search Functionality** across company names and descriptions
- **Data Validation** with comprehensive error handling
- **Pagination** for efficient data loading
- **Statistics API** for dashboard insights
- **Rate Limiting** and security middleware
- **MongoDB Integration** with optimized queries and indexing

### Frontend (React.js)
- **Modern UI/UX** with responsive design
- **Advanced Filtering** with real-time updates
- **Multiple View Modes** (Grid and Table views)
- **Interactive Forms** with validation
- **Statistics Dashboard** with key metrics
- **Search and Quick Filters**
- **Mobile-Friendly** responsive design

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS, Helmet, Morgan (Security & Logging)
- Express Rate Limit

**Frontend:**
- React.js (Functional Components with Hooks)
- Axios for API calls
- Modern CSS with Flexbox/Grid
- Responsive Design

## 📁 Project Structure

```
company-management-system/
├── backend/
│   ├── models/
│   │   └── Company.js          # MongoDB Schema
│   ├── routes/
│   │   └── companies.js        # API Routes
│   ├── config/
│   │   └── database.js         # Database Connection
│   ├── middleware/
│   │   └── cors.js            # CORS Configuration
│   ├── server.js              # Main Server File
│   ├── package.json
│   └── .env                   # Environment Variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompanyList.js    # Company Display Component
│   │   │   ├── CompanyCard.js    # Individual Company Card
│   │   │   ├── CompanyForm.js    # Add/Edit Form
│   │   │   └── FilterControls.js # Search & Filter UI
│   │   ├── services/
│   │   │   └── api.js            # API Service Layer
│   │   ├── App.js               # Main App Component
│   │   ├── App.css              # Styles
│   │   └── index.js             # React Entry Point
│   ├── public/
│   │   └── index.html
│   └── package.json
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd company-management-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your MongoDB URI
   npm run dev
   ```

3. **Setup Frontend** (In a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Start MongoDB**
   ```bash
   mongod
   # or if using MongoDB service
   brew services start mongodb-community
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/company-management
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📊 API Endpoints

### Companies
- `GET /api/companies` - Get all companies (with filtering & pagination)
- `GET /api/companies/:id` - Get single company
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company (soft delete)
- `GET /api/companies/stats` - Get company statistics
- `POST /api/companies/bulk` - Bulk create companies

### Query Parameters for GET /api/companies
```
?page=1&limit=10&industry=Technology&size=Startup&city=Bangalore&search=tech
```
## Screenshots

### Dashboard
![Dashboard](https://github.com/mrityu12/company-management-system/blob/18a61d9f8184ea4facbfb1132e1f99346ac52846/Screenshot%202025-08-24%20230020.png)

### Employee List
![Employee List](https://github.com/mrityu12/company-management-system/blob/18a61d9f8184ea4facbfb1132e1f99346ac52846/Screenshot%202025-08-24%20230031.png)

### Reports
![Reports](https://github.com/mrityu12/company-management-system/blob/18a61d9f8184ea4facbfb1132e1f99346ac52846/Screenshot%202025-08-24%20230109.png)


## 🎨 UI Features

### Dashboard
- **Statistics Cards** showing total companies, industries, and locations
- **Real-time Filtering** with immediate results
- **Responsive Grid/Table Views**

### Company Management
- **Add/Edit Forms** with comprehensive validation
- **Smart Filtering** by industry, size, location
- **Search Functionality** across multiple fields
- **Quick Filter Buttons** for common searches

### User Experience
- **Loading States** and error handling
- **Mobile-Responsive** design
- **Modern UI** with smooth animations
- **Accessibility** considerations

## 🔍 Search & Filter Features

### Available Filters
- **Industry**: Technology, Healthcare, Finance, etc.
- **Company Size**: Startup, Small, Medium, Large, Enterprise
- **Location**: City and State filtering
- **Text Search**: Search across company names and descriptions

### Quick Filters
- Technology companies
- Startups
- Enterprise companies
- Location-based (Bangalore, Mumbai, etc.)

## 📱 Responsive Design

The application is fully responsive and works well on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to services like Heroku, Vercel, or AWS
3. Ensure MongoDB Atlas connection for production

### Frontend Deployment
1. Run `npm run build` in frontend directory
2. Deploy build folder to Netlify, Vercel, or similar
3. Update API URLs for production

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Configuration**: Secure cross-origin requests  
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses
- **Helmet.js**: Security headers

## 📈 Performance Optimizations

- **MongoDB Indexing**: Optimized queries
- **Pagination**: Efficient data loading
- **Lazy Loading**: Components load as needed
- **Caching**: API response optimization
- **Minification**: Production build optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- MongoDB for the database
- React.js community for excellent documentation
- Express.js for the robust web framework
- All contributors and supporters

---

**Built with ❤️ Mrityunjay Kumar using Node.js, React.js, and MongoDB**
