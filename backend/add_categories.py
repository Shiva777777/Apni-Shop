import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from products.models import Category, SubCategory

# Define categories with subcategories
categories_data = {
    'Electronics': ['Mobiles', 'Laptops', 'Accessories'],
    'Fashion': ['Men', 'Women', 'Kids', 'Footwear'],
    'Home & Kitchen': ['Furniture', 'Appliances', 'Decor'],
    'Beauty & Personal Care': [],
    'Grocery': [],
    'Sports & Fitness': [],
    'Toys & Baby': [],
    'Automotive': [],
    'Books & Stationery': [],
    'Tools & Hardware': [],
    'Health & Wellness': []
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