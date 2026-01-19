# Apni Shop - E-Commerce Platform

A complete, production-ready e-commerce web application similar to Flipkart/Meesho with Django backend, React frontend, MySQL database, and Docker containerization.

## 🚀 Features

### Authentication & Authorization
- User registration with email verification
- Separate login for users and admins
- JWT-based authentication
- Role-based access control (Admin/User)
- Password reset functionality

### User Features
- Browse products by category and subcategory
- Advanced product search with filters (price, rating, category)
- Product details with multiple images
- Reviews and ratings system
- Shopping cart management
- Wishlist functionality
- Multi-step checkout process
- Multiple payment options (Razorpay, Stripe, COD)
- Order tracking and history
- User profile and address management

### Admin Features
- Admin dashboard with statistics and charts
- Product management (CRUD operations)
- Category and subcategory management
- Order management with status updates
- Coupon and discount management
- User management
- Product image upload

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: MySQL 8.0
- **Server**: Gunicorn
- **Payment**: Razorpay & Stripe integration

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL with persistent volumes
- **Web Server**: Nginx (for frontend)

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0
- Docker & Docker Compose (for containerized deployment)

## 🔧 Local Development Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
- Copy `.env.example` to `.env`
- Update database credentials and other settings

6. Create MySQL database:
```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

7. Run migrations:
```bash
python manage.py migrate
```

8. Create superuser:
```bash
python manage.py createsuperuser
```

9. Run development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
- Update `.env` with backend API URL

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. Update environment variables in `backend/.env`

2. Build and start all services:
```bash
docker-compose up --build
```

3. Create superuser (in a new terminal):
```bash
docker-compose exec backend python manage.py createsuperuser
```

4. Access the application:
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- Admin Panel: `http://localhost:8000/admin`

### Stop services:
```bash
docker-compose down
```

### Stop and remove volumes:
```bash
docker-compose down -v
```

## 📁 Project Structure

```
New Apni Shop/
├── backend/
│   ├── accounts/          # User authentication & profiles
│   ├── products/          # Product management
│   ├── orders/            # Cart, orders, addresses
│   ├── wishlist/          # Wishlist functionality
│   ├── payments/          # Payment integration
│   ├── admin_dashboard/   # Admin statistics
│   ├── utils/             # Email utilities
│   ├── ecommerce/         # Main Django project
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login, Register, AdminLogin
│   │   │   └── admin/     # Admin pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-password

# Payment Gateways
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
STRIPE_PUBLIC_KEY=your-key
STRIPE_SECRET_KEY=your-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

### Key API Endpoints

**Authentication:**
- POST `/api/accounts/register/` - User registration
- POST `/api/accounts/login/` - User login
- POST `/api/accounts/admin/login/` - Admin login
- POST `/api/accounts/token/refresh/` - Refresh JWT token

**Products:**
- GET `/api/products/products/` - List products
- GET `/api/products/products/{slug}/` - Product details
- GET `/api/products/categories/` - List categories

**Orders:**
- GET `/api/orders/cart/` - Get cart
- POST `/api/orders/cart/add_item/` - Add to cart
- POST `/api/orders/orders/` - Create order
- GET `/api/orders/orders/` - Order history

**Wishlist:**
- GET `/api/wishlist/` - Get wishlist
- POST `/api/wishlist/add_item/` - Add to wishlist

## 🎨 Design Features

- Modern, responsive UI design
- Mobile-first approach
- Gradient backgrounds and smooth animations
- Toast notifications for user feedback
- Protected routes for authentication
- Role-based access control

## 🔒 Security Features

- JWT authentication with token refresh
- Password hashing with Django's built-in system
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure password validation
- Role-based permissions

## 📦 Database Models

- **User**: Custom user model with roles
- **Category & SubCategory**: Product categorization
- **Product**: With pricing, discounts, stock
- **ProductImage**: Multiple images per product
- **Review**: Product reviews and ratings
- **Cart & CartItem**: Shopping cart
- **Address**: User addresses
- **Order & OrderItem**: Order management
- **Coupon**: Discount coupons
- **Wishlist**: User wishlists
- **Payment**: Payment transactions

## 🚀 Deployment

### Production Checklist

1. Set `DEBUG=False` in backend/.env
2. Update `ALLOWED_HOSTS` with your domain
3. Configure production database
4. Set up email service (SendGrid, AWS SES, etc.)
5. Configure payment gateway credentials
6. Set up SSL certificates
7. Configure static file serving
8. Set up monitoring and logging

### Cloud Deployment Options

- **AWS**: EC2, RDS, S3, CloudFront
- **DigitalOcean**: Droplets, Managed Databases
- **Heroku**: Web dynos, Postgres add-on
- **Render**: Web services, PostgreSQL

## 📝 License

This project is created for educational and commercial purposes.

## 👥 Support

For issues and questions, please create an issue in the repository.

## 🎯 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Multi-vendor support
- Social media authentication
- Product recommendations
- Live chat support
- Mobile app (React Native)

---

**Built with ❤️ using Django & React**
#   A p n i - S h o p  
 