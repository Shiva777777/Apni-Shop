"""
Django management command to create sample categories, subcategories, and products.
Run: python manage.py create_sample_data
"""

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from products.models import Category, SubCategory, Product, ProductImage
import urllib.request
import random


class Command(BaseCommand):
    help = 'Create sample categories, subcategories, and products with images'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Creating sample data...'))
        
        # Create Categories and SubCategories
        categories_data = {
            'Electronics': {
                'description': 'Latest gadgets, mobiles, laptops and electronic accessories',
                'subcategories': [
                    ('Smartphones', 'Latest Android and iOS smartphones'),
                    ('Laptops', 'Notebooks, Gaming laptops, Ultrabooks'),
                    ('Headphones', 'Wireless, Wired, Gaming headphones'),
                    ('Smartwatches', 'Fitness trackers and smartwatches'),
                    ('Cameras', 'DSLR, Mirrorless and Action cameras'),
                ]
            },
            'Fashion': {
                'description': 'Trendy clothing, footwear and accessories',
                'subcategories': [
                    ('Men\'s Clothing', 'T-shirts, Shirts, Jeans, Jackets'),
                    ('Women\'s Clothing', 'Dresses, Tops, Sarees, Kurtas'),
                    ('Footwear', 'Shoes, Sneakers, Sandals, Heels'),
                    ('Accessories', 'Watches, Belts, Wallets, Bags'),
                    ('Kids Wear', 'Clothing for children'),
                ]
            },
            'Home & Living': {
                'description': 'Furniture, decor and home essentials',
                'subcategories': [
                    ('Furniture', 'Sofas, Beds, Tables, Chairs'),
                    ('Home Decor', 'Wall art, Lamps, Vases, Clocks'),
                    ('Kitchen', 'Cookware, Appliances, Utensils'),
                    ('Bedding', 'Bedsheets, Pillows, Blankets'),
                    ('Storage', 'Organizers, Boxes, Racks'),
                ]
            },
            'Beauty & Health': {
                'description': 'Skincare, makeup and personal care',
                'subcategories': [
                    ('Skincare', 'Moisturizers, Serums, Cleansers'),
                    ('Makeup', 'Lipsticks, Foundation, Eyeshadows'),
                    ('Hair Care', 'Shampoos, Conditioners, Oils'),
                    ('Fragrances', 'Perfumes, Deodorants, Body mists'),
                    ('Health Devices', 'BP monitors, Thermometers'),
                ]
            },
            'Sports & Fitness': {
                'description': 'Sports equipment and fitness gear',
                'subcategories': [
                    ('Gym Equipment', 'Dumbbells, Treadmills, Yoga mats'),
                    ('Sports Shoes', 'Running, Training, Basketball shoes'),
                    ('Outdoor Sports', 'Cricket, Football, Badminton'),
                    ('Fitness Accessories', 'Bands, Gloves, Water bottles'),
                    ('Sportswear', 'Jerseys, Shorts, Track suits'),
                ]
            },
            'Books & Stationery': {
                'description': 'Books, office supplies and study materials',
                'subcategories': [
                    ('Fiction', 'Novels, Stories, Thrillers'),
                    ('Non-Fiction', 'Self-help, Biography, Business'),
                    ('Educational', 'Textbooks, Reference, Competitive'),
                    ('Kids Books', 'Picture books, Story books'),
                    ('Office Supplies', 'Pens, Notebooks, Organizers'),
                ]
            },
        }

        # Create categories and subcategories
        created_categories = {}
        for cat_name, cat_data in categories_data.items():
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': cat_data['description'], 'is_active': True}
            )
            created_categories[cat_name] = {'obj': category, 'subcategories': {}}
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {cat_name}'))
            else:
                self.stdout.write(f'Category already exists: {cat_name}')
            
            for sub_name, sub_desc in cat_data['subcategories']:
                # Check if subcategory already exists
                subcategory = SubCategory.objects.filter(category=category, name=sub_name).first()
                if subcategory:
                    self.stdout.write(f'  SubCategory already exists: {sub_name}')
                else:
                    subcategory = SubCategory.objects.create(
                        category=category,
                        name=sub_name,
                        description=sub_desc,
                        is_active=True
                    )
                    self.stdout.write(self.style.SUCCESS(f'  Created subcategory: {sub_name}'))
                
                created_categories[cat_name]['subcategories'][sub_name] = subcategory

        # Sample Products Data
        products_data = [
            # Electronics - Smartphones
            {
                'name': 'iPhone 15 Pro Max',
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'price': 134900,
                'discount_percentage': 5,
                'stock': 50,
                'brand': 'Apple',
                'description': 'The most powerful iPhone ever with A17 Pro chip, titanium design, and Action button.'
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'price': 129999,
                'discount_percentage': 10,
                'stock': 45,
                'brand': 'Samsung',
                'description': 'Premium flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.'
            },
            {
                'name': 'OnePlus 12',
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'price': 64999,
                'discount_percentage': 8,
                'stock': 100,
                'brand': 'OnePlus',
                'description': 'Flagship killer with Hasselblad camera, 100W charging, and fluid AMOLED display.'
            },
            # Electronics - Laptops
            {
                'name': 'MacBook Air M3',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 114900,
                'discount_percentage': 0,
                'stock': 30,
                'brand': 'Apple',
                'description': 'Incredibly thin and light with M3 chip, 18-hour battery life, and stunning Liquid Retina display.'
            },
            {
                'name': 'Dell XPS 15',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 149990,
                'discount_percentage': 12,
                'stock': 25,
                'brand': 'Dell',
                'description': 'Premium ultrabook with 4K OLED display, Intel Core Ultra, and InfinityEdge design.'
            },
            {
                'name': 'ASUS ROG Strix G16',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 124990,
                'discount_percentage': 15,
                'stock': 20,
                'brand': 'ASUS',
                'description': 'Gaming powerhouse with RTX 4070, 240Hz display, and advanced cooling system.'
            },
            # Electronics - Headphones
            {
                'name': 'Sony WH-1000XM5',
                'category': 'Electronics',
                'subcategory': 'Headphones',
                'price': 29990,
                'discount_percentage': 10,
                'stock': 80,
                'brand': 'Sony',
                'description': 'Industry-leading noise cancellation, 30-hour battery, and crystal-clear calls.'
            },
            {
                'name': 'AirPods Pro 2nd Gen',
                'category': 'Electronics',
                'subcategory': 'Headphones',
                'price': 24900,
                'discount_percentage': 5,
                'stock': 120,
                'brand': 'Apple',
                'description': 'Adaptive Audio, Personalized Spatial Audio, and USB-C MagSafe charging case.'
            },
            # Fashion - Men's Clothing
            {
                'name': 'Premium Cotton Casual Shirt',
                'category': 'Fashion',
                'subcategory': 'Men\'s Clothing',
                'price': 1299,
                'discount_percentage': 30,
                'stock': 200,
                'brand': 'Allen Solly',
                'description': 'Comfortable cotton casual shirt perfect for everyday wear. Available in multiple colors.'
            },
            {
                'name': 'Slim Fit Denim Jeans',
                'category': 'Fashion',
                'subcategory': 'Men\'s Clothing',
                'price': 1999,
                'discount_percentage': 25,
                'stock': 150,
                'brand': 'Levis',
                'description': 'Classic slim fit jeans with premium denim fabric and comfortable stretch.'
            },
            {
                'name': 'Leather Bomber Jacket',
                'category': 'Fashion',
                'subcategory': 'Men\'s Clothing',
                'price': 4999,
                'discount_percentage': 20,
                'stock': 60,
                'brand': 'H&M',
                'description': 'Stylish faux leather bomber jacket with quilted lining for winter.'
            },
            # Fashion - Women's Clothing
            {
                'name': 'Floral Print Maxi Dress',
                'category': 'Fashion',
                'subcategory': 'Women\'s Clothing',
                'price': 1799,
                'discount_percentage': 35,
                'stock': 180,
                'brand': 'Zara',
                'description': 'Elegant floral print maxi dress perfect for summer occasions.'
            },
            {
                'name': 'Silk Banarasi Saree',
                'category': 'Fashion',
                'subcategory': 'Women\'s Clothing',
                'price': 8999,
                'discount_percentage': 15,
                'stock': 40,
                'brand': 'Fabindia',
                'description': 'Traditional Banarasi silk saree with intricate zari work and rich colors.'
            },
            # Fashion - Footwear
            {
                'name': 'Nike Air Max 270',
                'category': 'Fashion',
                'subcategory': 'Footwear',
                'price': 12995,
                'discount_percentage': 18,
                'stock': 75,
                'brand': 'Nike',
                'description': 'Iconic lifestyle sneakers with Max Air unit for supreme comfort.'
            },
            {
                'name': 'Adidas Ultraboost 23',
                'category': 'Fashion',
                'subcategory': 'Footwear',
                'price': 16999,
                'discount_percentage': 20,
                'stock': 60,
                'brand': 'Adidas',
                'description': 'Premium running shoes with BOOST midsole and Primeknit upper.'
            },
            # Home & Living
            {
                'name': 'L-Shaped Sectional Sofa',
                'category': 'Home & Living',
                'subcategory': 'Furniture',
                'price': 45999,
                'discount_percentage': 22,
                'stock': 15,
                'brand': 'Urban Ladder',
                'description': 'Modern L-shaped sofa with premium fabric upholstery and wooden legs.'
            },
            {
                'name': 'Memory Foam Mattress King',
                'category': 'Home & Living',
                'subcategory': 'Bedding',
                'price': 24999,
                'discount_percentage': 30,
                'stock': 25,
                'brand': 'Sleepwell',
                'description': 'Orthopedic memory foam mattress with cooling gel technology.'
            },
            {
                'name': 'Non-Stick Cookware Set',
                'category': 'Home & Living',
                'subcategory': 'Kitchen',
                'price': 3999,
                'discount_percentage': 40,
                'stock': 100,
                'brand': 'Prestige',
                'description': '7-piece non-stick cookware set with glass lids and heat-resistant handles.'
            },
            # Beauty & Health
            {
                'name': 'Vitamin C Serum',
                'category': 'Beauty & Health',
                'subcategory': 'Skincare',
                'price': 899,
                'discount_percentage': 15,
                'stock': 300,
                'brand': 'The Ordinary',
                'description': 'Brightening serum with 10% Vitamin C for radiant, glowing skin.'
            },
            {
                'name': 'Matte Liquid Lipstick Set',
                'category': 'Beauty & Health',
                'subcategory': 'Makeup',
                'price': 1299,
                'discount_percentage': 25,
                'stock': 200,
                'brand': 'MAC',
                'description': 'Long-lasting matte liquid lipstick set in 6 gorgeous shades.'
            },
            # Sports & Fitness
            {
                'name': 'Adjustable Dumbbell Set',
                'category': 'Sports & Fitness',
                'subcategory': 'Gym Equipment',
                'price': 8999,
                'discount_percentage': 20,
                'stock': 50,
                'brand': 'Decathlon',
                'description': 'Adjustable dumbbell set 2.5-24kg with quick-change mechanism.'
            },
            {
                'name': 'Premium Yoga Mat',
                'category': 'Sports & Fitness',
                'subcategory': 'Gym Equipment',
                'price': 1499,
                'discount_percentage': 10,
                'stock': 150,
                'brand': 'Boldfit',
                'description': 'Extra thick 6mm yoga mat with anti-slip texture and carrying strap.'
            },
            {
                'name': 'Running Shoes - Air Zoom',
                'category': 'Sports & Fitness',
                'subcategory': 'Sports Shoes',
                'price': 9999,
                'discount_percentage': 25,
                'stock': 80,
                'brand': 'Nike',
                'description': 'Lightweight running shoes with responsive Zoom Air cushioning.'
            },
            # Books & Stationery
            {
                'name': 'Atomic Habits by James Clear',
                'category': 'Books & Stationery',
                'subcategory': 'Non-Fiction',
                'price': 599,
                'discount_percentage': 15,
                'stock': 500,
                'brand': 'Penguin',
                'description': 'Bestselling book on building good habits and breaking bad ones.'
            },
            {
                'name': 'Premium Leather Notebook',
                'category': 'Books & Stationery',
                'subcategory': 'Office Supplies',
                'price': 799,
                'discount_percentage': 10,
                'stock': 200,
                'brand': 'Moleskine',
                'description': 'Classic hardcover notebook with 240 ivory-colored pages.'
            },
        ]

        # Create Products
        for product_data in products_data:
            cat_name = product_data.pop('category')
            subcat_name = product_data.pop('subcategory')
            
            category = created_categories[cat_name]['obj']
            subcategory = created_categories[cat_name]['subcategories'].get(subcat_name)
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'category': category,
                    'subcategory': subcategory,
                    'price': product_data['price'],
                    'discount_percentage': product_data['discount_percentage'],
                    'stock': product_data['stock'],
                    'brand': product_data['brand'],
                    'description': product_data['description'],
                    'status': 'ACTIVE'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product_data["name"]}'))
            else:
                self.stdout.write(f'Product already exists: {product_data["name"]}')

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data created successfully!'))
        self.stdout.write(self.style.NOTICE(f'\nSummary:'))
        self.stdout.write(f'  Categories: {Category.objects.count()}')
        self.stdout.write(f'  SubCategories: {SubCategory.objects.count()}')
        self.stdout.write(f'  Products: {Product.objects.count()}')
