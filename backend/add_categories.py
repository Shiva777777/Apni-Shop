import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from products.models import Category, SubCategory

# Define categories with subcategories
categories_data = {
    'Electronics': [
        'Smartphones',
        'Laptops',
        'Tablets',
        'Smartwatches',
        'Headphones',
        'Cameras',
        'Gaming Consoles'
    ],
    'Fashion': [
        'Men Clothing',
        'Women Clothing',
        'Kids Clothing',
        'Footwear',
        'Accessories',
        'Ethnic Wear'
    ],
    'Home & Kitchen': [
        'Kitchen Appliances',
        'Furniture',
        'Bedding',
        'Cookware',
        'Home Decor',
        'Lighting'
    ],
    'Sports & Outdoors': [
        'Sports Equipment',
        'Outdoor Gear',
        'Fitness Equipment',
        'Camping Gear',
        'Water Sports'
    ],
    'Books & Media': [
        'Books',
        'E-books',
        'Movies',
        'Music',
        'Audiobooks'
    ],
    'Beauty & Personal Care': [
        'Skincare',
        'Hair Care',
        'Makeup',
        'Fragrances',
        'Personal Care'
    ],
    'Toys & Games': [
        'Action Figures',
        'Board Games',
        'Puzzles',
        'LEGO',
        'Baby Toys',
        'Educational Toys'
    ],
    'Automotive': [
        'Car Accessories',
        'Bike Accessories',
        'Car Care',
        'Tools & Equipment'
    ]
}

# Create categories and subcategories
for category_name, subcategories in categories_data.items():
    # Create or get category
    category, created = Category.objects.get_or_create(
        name=category_name,
        defaults={
            'description': f'{category_name} products and items',
            'is_active': True
        }
    )
    
    if created:
        print(f"✓ Created category: {category_name}")
    else:
        print(f"→ Category already exists: {category_name}")
    
    # Create subcategories
    for subcategory_name in subcategories:
        subcategory, created = SubCategory.objects.get_or_create(
            category=category,
            name=subcategory_name,
            defaults={
                'description': f'{subcategory_name} in {category_name}',
                'is_active': True
            }
        )
        
        if created:
            print(f"  ✓ Created subcategory: {subcategory_name}")
        else:
            print(f"  → Subcategory already exists: {subcategory_name}")

print("\n✅ All categories and subcategories have been created successfully!")

# Show summary
total_categories = Category.objects.count()
total_subcategories = SubCategory.objects.count()
print(f"\nSummary:")
print(f"Total Categories: {total_categories}")
print(f"Total Subcategories: {total_subcategories}")
