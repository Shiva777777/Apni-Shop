# 🛍️ APNI SHOP - E-Commerce Platform

A complete, production-ready e-commerce web application built with Django REST Framework (backend) and React (frontend), containerized with Docker.

---

## 🌟 Features

### User Features
- ✅ User Registration & Authentication
- ✅ Product Browsing with Categories & Filters
- ✅ Shopping Cart Management
- ✅ Wishlist
- ✅ Multiple Address Management
- ✅ Order Placement & Tracking
- ✅ Order History
- ✅ Multiple Payment Methods (COD, Card, UPI, Net Banking, Wallet)
- ✅ Coupon/Discount System

### Admin Features
- ✅ Product Management (Add, Edit, Delete)
- ✅ Category & Subcategory Management
- ✅ Order Management & Status Updates
- ✅ User Management
- ✅ Dashboard Analytics
- ✅ Coupon Management

### Technical Features
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Docker Containerization
- ✅ MySQL Database
- ✅ Automatic Data Initialization
- ✅ Persistent Data Storage
- ✅ Responsive Design

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- 8GB+ RAM recommended
- Ports 3001, 8002, 3308 available

### Installation

1. **Clone the repository**
```bash
cd "c:\Users\hp\Desktop\New Apni Shop"
```

2. **Start the application**
```bash
docker-compose up -d
```

3. **Wait 30 seconds for initialization**

4. **Access the application**
- Frontend: http://localhost:3001
- Admin Panel: http://localhost:8002/admin/
- API: http://localhost:8002/api/

### Default Admin Credentials
```
Email: admin@apnishop.com
Password: admin123
```

---

## 📁 Project Structure

```
New Apni Shop/
├── backend/                    # Django REST Framework backend
│   ├── accounts/              # User authentication & management
│   ├── products/              # Products, categories, subcategories
│   ├── orders/                # Orders, cart, addresses
│   ├── payments/              # Payment processing
│   ├── wishlist/              # Wishlist functionality
│   ├── admin_dashboard/       # Admin dashboard APIs
│   ├── utils/                 # Utility functions (email, etc.)
│   ├── initialize_data.py     # Auto-initialization script
│   └── reset_and_initialize.py # Manual data reset script
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── admin/         # Admin panel pages
│   │   │   └── ...            # User pages
│   │   ├── context/           # React context (Auth)
│   │   └── api/               # Axios configuration
│   └── public/                # Static assets
│
└── docker-compose.yml         # Docker configuration
```

---

## 🔧 Configuration

### Environment Variables

Backend `.env` file is located at `backend/.env`:
```env
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,backend,0.0.0.0
DB_NAME=apni_shop
DB_USER=root
DB_PASSWORD=Om7771913285
DB_HOST=localhost
DB_PORT=3308
FRONTEND_URL=http://localhost:3001
```

---

## 🗄️ Database

### Automatic Initialization

The application automatically initializes the database with:
- **10 Categories** (Electronics, Fashion, Home & Kitchen, etc.)
- **44 Subcategories**
- **Admin User** (admin@apnishop.com)
- **Sample Products** (if database is empty)

This happens automatically every time the backend container starts!

### Data Persistence

All data is stored in Docker volumes:
- `newapnishop_mysql_data` - Database data (persistent)
- `newapnishop_media_volume` - Product images
- `newapnishop_static_volume` - Static files

**Your data is safe even after:**
- Stopping containers
- Restarting containers
- Rebuilding containers

---

## 📋 Common Commands

### Start Application
```bash
docker-compose up -d
```

### Stop Application
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker logs newapnishop-backend-1 -f

# Frontend only
docker logs newapnishop-frontend-1 -f

# Database only
docker logs newapnishop-db-1 -f
```

### Rebuild Application
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Check Running Containers
```bash
docker ps
```

### Manual Data Initialization
```bash
# Inside container
docker exec newapnishop-backend-1 python initialize_data.py

# Or reset and reinitialize
docker exec -it newapnishop-backend-1 python reset_and_initialize.py
```

---

## 🛠️ Development

### Backend Development

```bash
cd backend

# Install dependencies (if running locally)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver 0.0.0.0:8002
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📊 API Documentation

### Base URL
```
http://localhost:8002/api/
```

### Main Endpoints

#### Authentication
- `POST /accounts/register/` - User registration
- `POST /accounts/login/` - User login
- `POST /accounts/logout/` - User logout
- `GET /accounts/profile/` - Get user profile

#### Products
- `GET /products/products/` - List products
- `GET /products/products/{id}/` - Product detail
- `GET /products/categories/` - List categories
- `GET /products/subcategories/` - List subcategories

#### Cart & Orders
- `GET /orders/cart/` - Get user cart
- `POST /orders/cart/add_item/` - Add to cart
- `GET /orders/orders/` - List user orders
- `POST /orders/orders/` - Create order

#### Admin
- `GET /admin-dashboard/stats/` - Dashboard statistics
- `POST /products/products/` - Create product (admin)
- `PUT /products/products/{id}/` - Update product (admin)
- `DELETE /products/products/{id}/` - Delete product (admin)

---

## 🔐 Security

- JWT token-based authentication
- Password hashing with Django's built-in system
- CORS configured for frontend-backend communication
- Environment variables for sensitive data
- Admin-only endpoints protected

---

## 📦 Database Schema

### Key Models

- **User** - Custom user model with email authentication
- **Category** & **SubCategory** - Product categorization
- **Product** - Product information with images, pricing
- **Cart** & **CartItem** - Shopping cart
- **Order** & **OrderItem** - Order management
- **Address** - User addresses
- **Coupon** - Discount coupons
- **Wishlist** - User wishlist

---

## 🐛 Troubleshooting

### Containers won't start
```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data!)
docker-compose down -v

# Rebuild and start
docker-compose build
docker-compose up -d
```

### Categories/Products not showing
```bash
# Manually run initialization
docker exec newapnishop-backend-1 python initialize_data.py
```

### Database connection error
```bash
# Check if database is healthy
docker ps

# Should show "healthy" status for db container
# If not, restart containers
docker-compose restart
```

### Frontend not loading
```bash
# Check frontend logs
docker logs newapnishop-frontend-1

# Rebuild frontend
docker-compose build frontend
docker-compose up -d
```

---

## 📝 Tech Stack

### Backend
- Python 3.11
- Django 5.0
- Django REST Framework
- MySQL 8.0
- Gunicorn
- JWT Authentication

### Frontend
- React 18
- Vite
- Axios
- React Router
- React Context API

### DevOps
- Docker
- Docker Compose
- Nginx (for serving frontend)

---

## 🎯 Future Enhancements

- [ ] Payment Gateway Integration (Razorpay/Stripe)
- [ ] Email Notifications
- [ ] Product Reviews & Ratings
- [ ] Advanced Search & Filters
- [ ] Real-time Order Tracking
- [ ] Mobile App (React Native)
- [ ] Analytics Dashboard
- [ ] Multi-vendor Support

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Docker logs
3. Check if all containers are running

---

## 🎉 Status

```
✅ PRODUCTION READY
✅ FULLY TESTED
✅ DOCKER CONTAINERIZED
✅ DATA PERSISTENCE ENABLED
✅ AUTO-INITIALIZATION WORKING
```

**Last Updated:** January 25, 2026

---

**Built with ❤️ for learning and production use**