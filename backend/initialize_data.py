#!/usr/bin/env python
"""
AUTOMATIC DATA INITIALIZATION SCRIPT
This script runs automatically when the backend container starts
and ensures all necessary data is present in the database.
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Add 'apps' directory to Python path
apps_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'apps')
if apps_dir not in sys.path:
    sys.path.insert(0, apps_dir)

django.setup()

from products.models import Category, SubCategory, Product
from accounts.models import User
from django.core.files import File
from decimal import Decimal


def create_categories():
    """Create categories and subcategories if they don't exist"""
    print("\n🔄 Initializing Categories...")
    
    categories_data = {
        'Electronics': ['Mobiles', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Smart Watches'],
        'Fashion': ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Watches'],
        'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Cookware', 'Bedding'],
        'Beauty & Personal Care': ['Makeup', 'Skincare', 'Haircare', 'Fragrances', 'Grooming'],
        'Sports & Fitness': ['Exercise Equipment', 'Sports Gear', 'Supplements', 'Activewear'],
        'Books & Stationery': ['Books', 'Notebooks', 'Pens', 'Art Supplies'],
        'Toys & Baby': ['Toys', 'Baby Care', 'Kids Fashion', 'Educational'],
        'Grocery': ['Snacks', 'Beverages', 'Packaged Food', 'Staples'],
        'Automotive': ['Car Accessories', 'Bike Accessories', 'Car Care'],
        'Health & Wellness': ['Vitamins', 'Medical Devices', 'Health Foods']
    }
    
    categories_created = 0
    subcategories_created = 0
    
    for category_name, subcategories in categories_data.items():
        # Create or get category
        category, created = Category.objects.get_or_create(
            name=category_name,
            defaults={
                'description': f'Shop the best {category_name} products at amazing prices',
                'is_active': True
            }
        )
        
        if created:
            categories_created += 1
            print(f"  ✓ Created category: {category_name}")
        
        # Create subcategories
        for subcategory_name in subcategories:
            subcategory, created = SubCategory.objects.get_or_create(
                category=category,
                name=subcategory_name,
                defaults={
                    'description': f'Explore {subcategory_name} in {category_name}',
                    'is_active': True
                }
            )
            
            if created:
                subcategories_created += 1
    
    print(f"  ✅ Categories: {Category.objects.count()} total ({categories_created} new)")
    print(f"  ✅ Subcategories: {SubCategory.objects.count()} total ({subcategories_created} new)")


def create_admin_user():
    """Create admin user if doesn't exist"""
    print("\n🔄 Checking Admin User...")
    
    admin_email = 'admin@apnishop.com'
    
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_superuser(
            email=admin_email,
            password='admin123',
            first_name='Admin',
            last_name='User',
            phone='9999999999'
        )
        admin_user.is_admin = True
        admin_user.save()
        print(f"  ✓ Created admin user: {admin_email}")
        print(f"  📝 Password: admin123")
    else:
        print(f"  ✓ Admin user already exists: {admin_email}")


def create_sample_products():
    """Create sample products if database is empty"""
    print("\n🔄 Checking Sample Products...")
    
    if Product.objects.count() > 0:
        print(f"  ✓ Products already exist: {Product.objects.count()}")
        return
    
    print("  🔄 Creating sample products...")
    
    # Get categories
    try:
        electronics = Category.objects.get(name='Electronics')
        mobiles = SubCategory.objects.get(name='Mobiles', category=electronics)
        
        fashion = Category.objects.get(name='Fashion')
        men = SubCategory.objects.get(name='Men', category=fashion)
        
        # Sample products
        sample_products = [
            {
                'name': 'Premium Smartphone X1',
                'category': electronics,
                'subcategory': mobiles,
                'description': 'Latest flagship smartphone with amazing features',
                'price': Decimal('29999.00'),
                'discount_percentage': 15,
                'stock': 50,
                'is_featured': True,
            },
            {
                'name': 'Classic Denim Jacket',
                'category': fashion,
                'subcategory': men,
                'description': 'Stylish and comfortable denim jacket for men',
                'price': Decimal('2499.00'),
                'discount_percentage': 20,
                'stock': 100,
                'is_featured': True,
            },
        ]
        
        products_created = 0
        for product_data in sample_products:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                products_created += 1
        
        print(f"  ✅ Sample products created: {products_created}")
        
    except Exception as e:
        print(f"  ⚠️  Could not create sample products: {str(e)}")


def run_initialization():
    """Run all initialization tasks"""
    print("\n" + "="*60)
    print("🚀 APNI SHOP - AUTOMATIC DATA INITIALIZATION")
    print("="*60)
    
    try:
        create_categories()
        create_admin_user()
        create_sample_products()
        
        print("\n" + "="*60)
        print("✅ DATA INITIALIZATION COMPLETED SUCCESSFULLY!")
        print("="*60)
        
        # Summary
        print("\n📊 DATABASE SUMMARY:")
        print(f"  - Categories: {Category.objects.count()}")
        print(f"  - Subcategories: {SubCategory.objects.count()}")
        print(f"  - Products: {Product.objects.count()}")
        print(f"  - Users: {User.objects.count()}")
        
        print("\n🔐 ADMIN CREDENTIALS:")
        print("  Email: admin@apnishop.com")
        print("  Password: admin123")
        print("\n" + "="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR during initialization: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_initialization()
