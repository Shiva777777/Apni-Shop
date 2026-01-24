from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from accounts.models import User
from products.models import Category, SubCategory, Product, ProductImage
import requests
from io import BytesIO


class Command(BaseCommand):
    help = 'Setup admin user and add sample products to the store'

    def handle(self, *args, **options):
        # Step 1: Setup Admin User
        self.stdout.write(self.style.WARNING('\n=== Setting up Admin User ==='))
        admin_email = "admin@apnishop.com"
        admin_password = "Admin@123"
        
        try:
            admin = User.objects.get(email=admin_email)
            admin.set_password(admin_password)
            admin.is_staff = True
            admin.is_superuser = True
            admin.role = User.Role.ADMIN
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Admin user password reset successfully!'))
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
            self.stdout.write(self.style.SUCCESS(f'✓ Admin user created successfully!'))
        
        self.stdout.write(f'  📧 Email: {admin_email}')
        self.stdout.write(f'  🔑 Password: {admin_password}')
        
        # Step 2: Create Categories and Subcategories
        self.stdout.write(self.style.WARNING('\n=== Creating Categories ==='))
        
        categories_data = {
            'Electronics': ['Mobile Phones', 'Laptops', 'Headphones', 'Cameras'],
            'Fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Accessories'],
            'Home & Kitchen': ['Furniture', 'Kitchen Appliances', 'Home Decor', 'Bedding'],
            'Beauty & Health': ['Skincare', 'Makeup', 'Hair Care', 'Health Supplements'],
            'Sports & Fitness': ['Gym Equipment', 'Sports Wear', 'Outdoor Gear', 'Yoga'],
        }
        
        created_categories = {}
        for cat_name, subcats in categories_data.items():
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': f'All {cat_name} products', 'is_active': True}
            )
            created_categories[cat_name] = category
            status = '✓ Created' if created else '→ Exists'
            self.stdout.write(f'{status}: {cat_name}')
            
            for subcat_name in subcats:
                SubCategory.objects.get_or_create(
                    category=category,
                    name=subcat_name,
                    defaults={'description': f'{subcat_name} in {cat_name}', 'is_active': True}
                )
        
        # Step 3: Add Sample Products
        self.stdout.write(self.style.WARNING('\n=== Adding Sample Products ==='))
        
        products_data = [
            # Electronics
            {
                'name': 'iPhone 15 Pro Max',
                'category': 'Electronics',
                'subcategory': 'Mobile Phones',
                'price': 134900.00,
                'discount': 10,
                'stock': 50,
                'brand': 'Apple',
                'description': 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. 256GB storage with iOS 17.'
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'category': 'Electronics',
                'subcategory': 'Mobile Phones',
                'price': 124999.00,
                'discount': 15,
                'stock': 45,
                'brand': 'Samsung',
                'description': 'Flagship Samsung phone with S Pen, 200MP camera, and powerful performance. 512GB variant.'
            },
            {
                'name': 'Dell XPS 15 Laptop',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 159999.00,
                'discount': 12,
                'stock': 30,
                'brand': 'Dell',
                'description': 'Premium laptop with Intel Core i7, 16GB RAM, 512GB SSD, and stunning 15.6" OLED display.'
            },
            {
                'name': 'Sony WH-1000XM5 Headphones',
                'category': 'Electronics',
                'subcategory': 'Headphones',
                'price': 29990.00,
                'discount': 20,
                'stock': 75,
                'brand': 'Sony',
                'description': 'Industry-leading noise cancellation, premium sound quality, and 30-hour battery life.'
            },
            {
                'name': 'Canon EOS R6 Camera',
                'category': 'Electronics',
                'subcategory': 'Cameras',
                'price': 239999.00,
                'discount': 8,
                'stock': 20,
                'brand': 'Canon',
                'description': 'Professional mirrorless camera with 20.1MP full-frame sensor and 4K 60p video.'
            },
            
            # Fashion
            {
                'name': 'Levi\'s Men\'s Denim Jacket',
                'category': 'Fashion',
                'subcategory': 'Men\'s Clothing',
                'price': 3499.00,
                'discount': 25,
                'stock': 100,
                'brand': 'Levi\'s',
                'description': 'Classic trucker jacket in premium denim. Perfect for casual and semi-formal occasions.'
            },
            {
                'name': 'Nike Air Max 270 Shoes',
                'category': 'Fashion',
                'subcategory': 'Footwear',
                'price': 12995.00,
                'discount': 18,
                'stock': 85,
                'brand': 'Nike',
                'description': 'Comfortable running shoes with Max Air cushioning and breathable mesh upper.'
            },
            {
                'name': 'Zara Floral Dress',
                'category': 'Fashion',
                'subcategory': 'Women\'s Clothing',
                'price': 2999.00,
                'discount': 30,
                'stock': 60,
                'brand': 'Zara',
                'description': 'Elegant floral print dress perfect for summer. Available in multiple sizes.'
            },
            
            # Home & Kitchen
            {
                'name': 'Philips Air Fryer XXL',
                'category': 'Home & Kitchen',
                'subcategory': 'Kitchen Appliances',
                'price': 18999.00,
                'discount': 22,
                'stock': 40,
                'brand': 'Philips',
                'description': 'Cook healthier meals with up to 90% less fat. 1.4kg capacity with digital display.'
            },
            {
                'name': 'IKEA MALM Bed Frame',
                'category': 'Home & Kitchen',
                'subcategory': 'Furniture',
                'price': 24999.00,
                'discount': 15,
                'stock': 25,
                'brand': 'IKEA',
                'description': 'Queen size bed frame with storage. Modern Scandinavian design in oak veneer.'
            },
            
            # Beauty & Health
            {
                'name': 'L\'Oreal Paris Revitalift Serum',
                'category': 'Beauty & Health',
                'subcategory': 'Skincare',
                'price': 1299.00,
                'discount': 35,
                'stock': 150,
                'brand': 'L\'Oreal',
                'description': 'Anti-aging serum with Hyaluronic Acid and Pro-Retinol. Reduces wrinkles and firms skin.'
            },
            {
                'name': 'Maybelline Fit Me Foundation',
                'category': 'Beauty & Health',
                'subcategory': 'Makeup',
                'price': 599.00,
                'discount': 20,
                'stock': 120,
                'brand': 'Maybelline',
                'description': 'Long-lasting matte foundation. Available in 16 shades to match all skin tones.'
            },
            
            # Sports & Fitness
            {
                'name': 'Adidas Gym Bag',
                'category': 'Sports & Fitness',
                'subcategory': 'Gym Equipment',
                'price': 1999.00,
                'discount': 15,
                'stock': 90,
                'brand': 'Adidas',
                'description': 'Durable gym duffle bag with multiple compartments. Water-resistant material.'
            },
            {
                'name': 'Yoga Mat Premium',
                'category': 'Sports & Fitness',
                'subcategory': 'Yoga',
                'price': 899.00,
                'discount': 25,
                'stock': 200,
                'brand': 'FitnessFirst',
                'description': 'Non-slip, eco-friendly yoga mat with 6mm thickness. Includes carrying strap.'
            },
            {
                'name': 'Puma Running Shoes',
                'category': 'Sports & Fitness',
                'subcategory': 'Sports Wear',
                'price': 5999.00,
                'discount': 28,
                'stock': 70,
                'brand': 'Puma',
                'description': 'Lightweight running shoes with superior cushioning and breathable design.'
            },
        ]
        
        for product_data in products_data:
            category = created_categories[product_data['category']]
            subcategory = category.subcategories.filter(name=product_data['subcategory']).first()
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'category': category,
                    'subcategory': subcategory,
                    'price': product_data['price'],
                    'discount_percentage': product_data['discount'],
                    'stock': product_data['stock'],
                    'brand': product_data['brand'],
                    'description': product_data['description'],
                    'status': Product.Status.ACTIVE,
                }
            )
            
            status = '✓' if created else '→'
            discounted_price = product.discounted_price
            self.stdout.write(
                f'{status} {product.name}: ₹{product.price} → ₹{discounted_price} ({product.discount_percentage}% off) | Stock: {product.stock}'
            )
        
        # Final Summary
        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()
        total_products = Product.objects.count()
        
        self.stdout.write(self.style.SUCCESS('\n=== Setup Complete! ==='))
        self.stdout.write(f'📂 Categories: {total_categories}')
        self.stdout.write(f'📁 Subcategories: {total_subcategories}')
        self.stdout.write(f'🛍️  Products: {total_products}')
        self.stdout.write(self.style.SUCCESS('\n✨ Store is ready for use!'))
        self.stdout.write(self.style.WARNING('\n📝 Admin Login Credentials:'))
        self.stdout.write(f'   Email: {admin_email}')
        self.stdout.write(f'   Password: {admin_password}')
        self.stdout.write(f'\n🌐 Frontend: http://localhost:3001')
        self.stdout.write(f'🔧 Backend: http://localhost:8002')
        self.stdout.write(f'👨‍💼 Django Admin: http://localhost:8002/admin/\n')
