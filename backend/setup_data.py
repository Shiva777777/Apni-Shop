#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from accounts.models import User
from products.models import Category, SubCategory, Product

print("=" * 50)
print("SETUP SCRIPT STARTING")
print("=" * 50)

# 1. Create Admin User
print("\n1. Creating Admin User...")
admin_email = "admin@apnishop.com"
admin_password = "Admin@123"

try:
    admin = User.objects.get(email=admin_email)
    admin.set_password(admin_password)
    admin.is_staff = True
    admin.is_superuser = True
    admin.role = User.Role.ADMIN
    admin.save()
    print(f"✓ Admin password reset: {admin_email}")
except User.DoesNotExist:
    admin = User.objects.create_superuser(
        email=admin_email,
        password=admin_password,
        username="admin",
        first_name="Admin",
        last_name="User"
    )
    admin.role = User.Role.ADMIN
    admin.save()
    print(f"✓ Admin created: {admin_email}")

print(f"   Email: {admin_email}")
print(f"   Password: {admin_password}")

# 2. Create Categories
print("\n2. Creating Categories...")
electronics, _ = Category.objects.get_or_create(name="Electronics")
fashion, _ = Category.objects.get_or_create(name="Fashion")
home, _ = Category.objects.get_or_create(name="Home & Kitchen")
print("✓ Categories created")

# 3. Create Subcategories
print("\n3. Creating Subcategories...")
mobiles, _ = SubCategory.objects.get_or_create(category=electronics, name="Mobile Phones")
laptops, _ = SubCategory.objects.get_or_create(category=electronics, name="Laptops")
mens_clothing, _ = SubCategory.objects.get_or_create(category=fashion, name="Men's Clothing")
footwear, _ = SubCategory.objects.get_or_create(category=fashion, name="Footwear")
appliances, _ = SubCategory.objects.get_or_create(category=home, name="Kitchen Appliances")
print("✓ Subcategories created")

# 4. Create Products
print("\n4. Creating Products...")
products_data = [
    {
        'name': 'iPhone 15 Pro Max',
        'category': electronics,
        'subcategory': mobiles,
        'price': 134900.00,
        'discount_percentage': 10,
        'stock': 50,
        'brand': 'Apple',
        'description': 'Latest iPhone with A17 Pro chip'
    },
    {
        'name': 'Samsung Galaxy S24 Ultra',
        'category': electronics,
        'subcategory': mobiles,
        'price': 124999.00,
        'discount_percentage': 15,
        'stock': 45,
        'brand': 'Samsung',
        'description': 'Flagship Samsung phone with S Pen'
    },
    {
        'name': 'Dell XPS 15',
        'category': electronics,
        'subcategory': laptops,
        'price': 159999.00,
        'discount_percentage': 12,
        'stock': 30,
        'brand': 'Dell',
        'description': 'Premium laptop with Intel Core i7'
    },
    {
        'name': 'Levi\'s Denim Jacket',
        'category': fashion,
        'subcategory': mens_clothing,
        'price': 3499.00,
        'discount_percentage': 25,
        'stock': 100,
        'brand': 'Levi\'s',
        'description': 'Classic trucker jacket'
    },
    {
        'name': 'Nike Air Max 270',
        'category': fashion,
        'subcategory': footwear,
        'price': 12995.00,
        'discount_percentage': 18,
        'stock': 85,
        'brand': 'Nike',
        'description': 'Comfortable running shoes'
    },
    {
        'name': 'Philips Air Fryer XXL',
        'category': home,
        'subcategory': appliances,
        'price': 18999.00,
        'discount_percentage': 22,
        'stock': 40,
        'brand': 'Philips',
        'description': 'Cook healthier with 90% less fat'
    },
]

for product_data in products_data:
    product, created = Product.objects.get_or_create(
        name=product_data['name'],
        defaults=product_data
    )
    status = '✓ Created' if created else '→ Exists'
    print(f"{status}: {product.name} - ₹{product.price}")

print("\n" + "=" * 50)
print("SETUP COMPLETE!")
print("=" * 50)
print(f"\n📝 Admin Login:")
print(f"   Email: {admin_email}")
print(f"   Password: {admin_password}")
print(f"\n🛍️  Products: {Product.objects.count()}")
print(f"📂 Categories: {Category.objects.count()}")
print(f"📁 Subcategories: {SubCategory.objects.count()}")
print("\n✅ You can now login and manage products!")
