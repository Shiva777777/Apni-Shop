"""
Script to add sample products to Apni Shop database
Run this in the backend directory:
    python add_sample_products.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from accounts.models import User
from products.models import Category, SubCategory, Product

def main():
    print("="*60)
    print("🛍️  APNI SHOP - ADDING SAMPLE PRODUCTS")
    print("="*60)
    
    # 1. Setup Admin User
    print("\n📝 Step 1: Setting up Admin User...")
    admin_email = "admin@apnishop.com"
    admin_password = "Admin@123"
    
    try:
        admin = User.objects.get(email=admin_email)
        admin.set_password(admin_password)
        admin.is_staff = True
        admin.is_superuser = True
        admin.role = User.Role.ADMIN
        admin.save()
        print(f"✅ Admin password reset successfully!")
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
        print(f"✅ Admin user created successfully!")
    
    print(f"   📧 Email: {admin_email}")
    print(f"   🔑 Password: {admin_password}")
    
    # 2. Create Categories
    print("\n📂 Step 2: Creating Categories...")
    categories_data = {
        'Electronics': 'Latest electronics and gadgets',
        'Fashion': 'Trendy fashion and accessories',
        'Home & Kitchen': 'Home essentials and kitchen items',
        'Beauty & Health': 'Beauty products and health supplements',
        'Sports & Fitness': 'Sports equipment and fitness gear',
    }
    
    created_categories = {}
    for cat_name, cat_desc in categories_data.items():
        category, created = Category.objects.get_or_create(
            name=cat_name,
            defaults={'description': cat_desc, 'is_active': True}
        )
        created_categories[cat_name] = category
        status = '✅ Created' if created else '→ Already exists'
        print(f"   {status}: {cat_name}")
    
    # 3. Create Subcategories
    print("\n📁 Step 3: Creating Subcategories...")
    subcategories_data = {
        'Electronics': ['Mobile Phones', 'Laptops', 'Headphones', 'Cameras', 'Smartwatches'],
        'Fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Accessories', 'Watches'],
        'Home & Kitchen': ['Furniture', 'Kitchen Appliances', 'Home Decor', 'Bedding', 'Storage'],
        'Beauty & Health': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Health Supplements'],
        'Sports & Fitness': ['Gym Equipment', 'Sports Wear', 'Outdoor Gear', 'Yoga', 'Cycles'],
    }
    
    for cat_name, subcats in subcategories_data.items():
        category = created_categories[cat_name]
        for subcat_name in subcats:
            SubCategory.objects.get_or_create(
                category=category,
                name=subcat_name,
                defaults={'description': f'{subcat_name} in {cat_name}', 'is_active': True}
            )
    print("   ✅ All subcategories created")
    
    # 4. Add Sample Products
    print("\n🛍️  Step 4: Adding Sample Products...")
    products_data = [
        # Electronics
        {
            'name': 'iPhone 15 Pro Max',
            'category': 'Electronics',
            'subcategory': 'Mobile Phones',
            'price': '134900.00',
            'discount_percentage': '10',
            'stock': 50,
            'brand': 'Apple',
            'description': 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 256GB storage.',
            'sku': 'APPLE-IP15PM-256'
        },
        {
            'name': 'Samsung Galaxy S24 Ultra',
            'category': 'Electronics',
            'subcategory': 'Mobile Phones',
            'price': '124999.00',
            'discount_percentage': '15',
            'stock': 45,
            'brand': 'Samsung',
            'description': 'Flagship Samsung phone with S Pen, 200MP camera, powerful performance, and 512GB storage.',
            'sku': 'SAMSUNG-S24U-512'
        },
        {
            'name': 'OnePlus 12',
            'category': 'Electronics',
            'subcategory': 'Mobile Phones',
            'price': '64999.00',
            'discount_percentage': '12',
            'stock': 60,
            'brand': 'OnePlus',
            'description': 'Premium flagship with 100W fast charging, Hasselblad cameras, and smooth 120Hz display.',
            'sku': 'ONEPLUS-12-256'
        },
        {
            'name': 'Dell XPS 15 Laptop',
            'category': 'Electronics',
            'subcategory': 'Laptops',
            'price': '159999.00',
            'discount_percentage': '12',
            'stock': 30,
            'brand': 'Dell',
            'description': 'Premium laptop with Intel Core i7, 16GB RAM, 512GB SSD, and stunning 15.6" OLED display.',
            'sku': 'DELL-XPS15-I7'
        },
        {
            'name': 'MacBook Air M3',
            'category': 'Electronics',
            'subcategory': 'Laptops',
            'price': '114900.00',
            'discount_percentage': '8',
            'stock': 25,
            'brand': 'Apple',
            'description': 'Ultra-thin laptop with M3 chip, 18-hour battery life, and brilliant Retina display.',
            'sku': 'APPLE-MBA-M3'
        },
        {
            'name': 'Sony WH-1000XM5 Headphones',
            'category': 'Electronics',
            'subcategory': 'Headphones',
            'price': '29990.00',
            'discount_percentage': '20',
            'stock': 75,
            'brand': 'Sony',
            'description': 'Industry-leading noise cancellation, premium sound quality, and 30-hour battery life.',
            'sku': 'SONY-WH1000XM5'
        },
        
        # Fashion
        {
            'name': 'Levi\'s Men\'s Denim Jacket',
            'category': 'Fashion',
            'subcategory': 'Men\'s Clothing',
            'price': '3499.00',
            'discount_percentage': '25',
            'stock': 100,
            'brand': 'Levi\'s',
            'description': 'Classic trucker jacket in premium denim. Perfect for casual and semi-formal occasions.',
            'sku': 'LEVIS-JACKET-M'
        },
        {
            'name': 'Nike Air Max 270 Shoes',
            'category': 'Fashion',
            'subcategory': 'Footwear',
            'price': '12995.00',
            'discount_percentage': '18',
            'stock': 85,
            'brand': 'Nike',
            'description': 'Comfortable running shoes with Max Air cushioning and breathable mesh upper.',
            'sku': 'NIKE-AM270'
        },
        {
            'name': 'Adidas Ultraboost 23',
            'category': 'Fashion',
            'subcategory': 'Footwear',
            'price': '15999.00',
            'discount_percentage': '20',
            'stock': 70,
            'brand': 'Adidas',
            'description': 'Premium running shoes with Boost cushioning and Primeknit upper for ultimate comfort.',
            'sku': 'ADIDAS-UB23'
        },
        {
            'name': 'Zara Floral Summer Dress',
            'category': 'Fashion',
            'subcategory': 'Women\'s Clothing',
            'price': '2999.00',
            'discount_percentage': '30',
            'stock': 60,
            'brand': 'Zara',
            'description': 'Elegant floral print dress perfect for summer outings. Available in multiple sizes.',
            'sku': 'ZARA-DRESS-FL'
        },
        
        # Home & Kitchen
        {
            'name': 'Philips Air Fryer XXL',
            'category': 'Home & Kitchen',
            'subcategory': 'Kitchen Appliances',
            'price': '18999.00',
            'discount_percentage': '22',
            'stock': 40,
            'brand': 'Philips',
            'description': 'Cook healthier meals with up to 90% less fat. 1.4kg capacity with digital display.',
            'sku': 'PHILIPS-AF-XXL'
        },
        {
            'name': 'LG Microwave Oven 28L',
            'category': 'Home & Kitchen',
            'subcategory': 'Kitchen Appliances',
            'price': '12999.00',
            'discount_percentage': '15',
            'stock': 35,
            'brand': 'LG',
            'description': 'Convection microwave with 28L capacity, auto-cook menus, and child lock feature.',
            'sku': 'LG-MW-28L'
        },
        {
            'name': 'IKEA MALM Bed Frame',
            'category': 'Home & Kitchen',
            'subcategory': 'Furniture',
            'price': '24999.00',
            'discount_percentage': '15',
            'stock': 25,
            'brand': 'IKEA',
            'description': 'Queen size bed frame with storage. Modern Scandinavian design in oak veneer.',
            'sku': 'IKEA-MALM-Q'
        },
        
        # Beauty & Health
        {
            'name': 'L\'Oreal Paris Revitalift Serum',
            'category': 'Beauty & Health',
            'subcategory': 'Skincare',
            'price': '1299.00',
            'discount_percentage': '35',
            'stock': 150,
            'brand': 'L\'Oreal',
            'description': 'Anti-aging serum with Hyaluronic Acid and Pro-Retinol. Reduces wrinkles and firms skin.',
            'sku': 'LOREAL-RVTL-SRM'
        },
        {
            'name': 'Maybelline Fit Me Foundation',
            'category': 'Beauty & Health',
            'subcategory': 'Makeup',
            'price': '599.00',
            'discount_percentage': '20',
            'stock': 120,
            'brand': 'Maybelline',
            'description': 'Long-lasting matte foundation. Available in 16 shades to match all skin tones.',
            'sku': 'MAYB-FITME-FND'
        },
        
        # Sports & Fitness
        {
            'name': 'Adidas Gym Duffle Bag',
            'category': 'Sports & Fitness',
            'subcategory': 'Gym Equipment',
            'price': '1999.00',
            'discount_percentage': '15',
            'stock': 90,
            'brand': 'Adidas',
            'description': 'Durable gym duffle bag with multiple compartments. Water-resistant material.',
            'sku': 'ADIDAS-GYM-BAG'
        },
        {
            'name': 'Premium Yoga Mat 6mm',
            'category': 'Sports & Fitness',
            'subcategory': 'Yoga',
            'price': '899.00',
            'discount_percentage': '25',
            'stock': 200,
            'brand': 'FitnessFirst',
            'description': 'Non-slip, eco-friendly yoga mat with 6mm thickness. Includes carrying strap.',
            'sku': 'FF-YOGA-MAT-6'
        },
        {
            'name': 'Puma Speed Running Shoes',
            'category': 'Sports & Fitness',
            'subcategory': 'Sports Wear',
            'price': '5999.00',
            'discount_percentage': '28',
            'stock': 70,
            'brand': 'Puma',
            'description': 'Lightweight running shoes with superior cushioning and breathable design.',
            'sku': 'PUMA-SPEED-RUN'
        },
    ]
    
    for product_data in products_data:
        from decimal import Decimal
        category = created_categories[product_data['category']]
        subcategory = category.subcategories.filter(name=product_data['subcategory']).first()
        
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            defaults={
                'category': category,
                'subcategory': subcategory,
                'price': Decimal(product_data['price']),
                'discount_percentage': Decimal(product_data['discount_percentage']),
                'stock': product_data['stock'],
                'brand': product_data['brand'],
                'description': product_data['description'],
                'sku': product_data.get('sku', ''),
                'status': Product.Status.ACTIVE,
            }
        )
        
        if created:
            discounted_price = product.discounted_price
            print(f"   ✅ {product.name}")
            print(f"      💰 ₹{product.price} → ₹{discounted_price} ({product.discount_percentage}% off)")
            print(f"      📦 Stock: {product.stock}")
        else:
            print(f"   → {product.name} (already exists)")
    
    # Final Summary
    print("\n" + "="*60)
    print("✨ SETUP COMPLETE!")
    print("="*60)
    print(f"\n📊 Database Statistics:")
    print(f"   📂 Categories: {Category.objects.count()}")
    print(f"   📁 Subcategories: {SubCategory.objects.count()}")
    print(f"   🛍️  Products: {Product.objects.count()}")
    print(f"   👥 Users: {User.objects.count()}")
    
    print(f"\n🔐 Admin Login Credentials:")
    print(f"   📧 Email: {admin_email}")
    print(f"   🔑 Password: {admin_password}")
    
    print(f"\n🌐 Access URLs:")
    print(f"   🏪 Frontend: http://localhost:3001")
    print(f"   👨‍💼 Django Admin: http://localhost:8001/admin/")
    print(f"   🔧 API: http://localhost:8001/api/")
    
    print(f"\n✅ You can now:")
    print(f"   1. Login to admin panel and manage products")
    print(f"   2. Browse products on the frontend")
    print(f"   3. Test the ordering process")
    print("\n" + "="*60)

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
