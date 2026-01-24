# Apni Shop - Admin Access & Product Management Guide

## 🔑 Admin Login Credentials

### Django Admin Panel (Recommended)
- **URL**: http://localhost:8001/admin/
- **Email**: Try these credentials in order:
  1. `admin@apnishop.com` / `Admin@123`
  2. `admin@apnishop.com` / `admin`
  3. Check your previous conversations for the password you set

### Frontend Admin Login
- **URL**: http://localhost:3001/login
- Same credentials as above

---

## 📦 Adding Products via Django Admin

### Method 1: Using Django Admin Panel (EASIEST)

1. **Access Admin Panel**:
   - Open: http://localhost:8001/admin/
   - Login with credentials above

2. **Add Categories**:
   - Click on "Categories" under PRODUCTS section
   - Click "Add Category" button
   - Examples:
     - Electronics
     - Fashion
     - Home & Kitchen
     - Beauty & Health
     - Sports & Fitness

3. **Add Subcategories**:
   - Click on "Subcategories"
   - Click "Add Subcategory"
   - Select parent category
   - Examples:
     - Electronics → Mobile Phones, Laptops, Headphones
     - Fashion → Men's Clothing, Women's Clothing, Footwear

4. **Add Products**:
   - Click on "Products"
   - Click "Add Product"
   - Fill in:
     - **Name**: Product name
     - **Category**: Select from dropdown
     - **Subcategory**: Select from dropdown
     - **Price**: Original price
     - **Discount Percentage**: Discount (0-100)
     - **Stock**: Available quantity
     - **Brand**: Brand name
     - **Description**: Product description
     - **Status**: Active
   - Click "Save"

---

## 🛍️ Sample Products to Add

Here are some ready-to-use product examples:

### Electronics - Mobile Phones
| Name | Price | Discount | Stock | Brand | Description |
|------|-------|----------|-------|-------|-------------|
| iPhone 15 Pro Max | 134900 | 10% | 50 | Apple | Latest iPhone with A17 Pro chip, titanium design |
| Samsung Galaxy S24 Ultra | 124999 | 15% | 45 | Samsung | Flagship phone with S Pen and 200MP camera |
| OnePlus 12 | 64999 | 12% | 60 | OnePlus | Fast charging, great cameras |

### Fashion - Footwear
| Name | Price | Discount | Stock | Brand | Description |
|------|-------|----------|-------|-------|-------------|
| Nike Air Max 270 | 12995 | 18% | 85 | Nike | Comfortable running shoes with Max Air |
| Adidas Ultraboost | 15999 | 20% | 70 | Adidas | Premium running shoes |

### Home & Kitchen - Appliances
| Name | Price | Discount | Stock | Brand | Description |
|------|-------|----------|-------|-------|-------------|
| Philips Air Fryer XXL | 18999 | 22% | 40 | Philips | Cook healthier with 90% less fat |
| LG Microwave Oven | 12999 | 15% | 35 | LG | 28L convection microwave |

---

## 🔧 Fixing Backend Port Issue

The frontend is configured for port 8002 but your working backend is on 8001.

### Option 1: Update Frontend to Use Port 8001  
Edit `frontend/src/api/axios.js`:
```javascript
const API_URL = 'http://localhost:8001/api';
```

### Option 2: Start Local Backend on Port 8002
```bash
cd backend
python manage.py runserver 8002
```

---

## 🧪 Testing Orders

### Step 1: Add Products (see above)

### Step 2: Test as Customer
1. Open http://localhost:3001
2. Click "Get Started" or "Sign Up"
3. Create a customer account:
   - Email: customer@test.com
   - Password: Test@123
4. Browse products
5. Add products to cart
6. Go to cart
7. Proceed to checkout
8. Fill in shipping address
9. Complete order

### Step 3: Verify Order as Admin
1. Login to admin panel: http://localhost:8001/admin/
2. Click on "Orders"
3. You should see the test order
4. Check order details:
   - Customer information
   - Products ordered
   - Total amount
   - Order status
   - Shipping address

---

## 📝 Product Management Features

### View All Products
- Admin Panel → Products → Shows list of all products

### Edit Product
1. Admin Panel → Products
2. Click on product name
3. Modify any field
4. Click "Save"

### Delete Product
1. Admin Panel → Products
2. Select product(s) using checkbox
3. Action → "Delete selected products"
4. Confirm deletion

### Manage Stock
1. Admin Panel → Products
2. Click on product
3. Update "Stock" field
4. Save

### Add Product Images
1. Admin Panel → Product Images
2. Add image → Select product
3. Upload image file
4. Mark as "Primary" if it's the main image
5. Save

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3001 | Customer-facing store |
| Backend API | http://localhost:8001/api | API endpoints |
| Django Admin | http://localhost:8001/admin | Product management |
| API Documentation | http://localhost:8001/api/docs | API reference (if configured) |

---

## 🔐 Security Note

**IMPORTANT**: These are development credentials. For production:
- Change all default passwords
- Use environment variables
- Enable HTTPS
- Configure proper CORS settings
- Set up proper authentication

---

## 🆘 Troubleshooting

### Products Not Showing in Frontend
1. Check if backend is running: http://localhost:8001/api/products/
2. Check browser console for errors
3. Verify frontend is configured for correct port

### Can't Login to Admin
1. Reset password using Django shell:
```bash
cd backend
python manage.py shell
```
```python
from accounts.models import User
admin = User.objects.get(email='admin@apnishop.com')
admin.set_password('Admin@123')
admin.save()
exit()
```

### Orders Not Creating
1. Check if products have stock > 0
2. Verify user is logged in
3. Check backend logs for errors
4. Ensure database is running

---

## 📞 Quick Reference Commands

```bash
# Start backend
cd backend
python manage.py runserver 8001

# Create superuser
python manage.py createsuperuser

# Check migrations
python manage.py showmigrations

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic
```

---

**Created**: 2026-01-24
**Last Updated**: 2026-01-24
