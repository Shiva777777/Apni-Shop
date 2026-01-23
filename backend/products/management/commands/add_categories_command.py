from django.core.management.base import BaseCommand
from products.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Adds the initial categories and subcategories to the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Creating categories and subcategories...'))

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

        for category_name, subcategories in categories_data.items():
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={
                    'description': f'{category_name} products and items',
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Created category: {category_name}"))
            else:
                self.stdout.write(f"→ Category already exists: {category_name}")

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
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Created subcategory: {subcategory_name}"))
                else:
                    self.stdout.write(f"  → Subcategory already exists: {subcategory_name}")

        self.stdout.write(self.style.SUCCESS('\n✅ All categories and subcategories have been created successfully!'))
        
        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()
        self.stdout.write(f"\nSummary:")
        self.stdout.write(f"Total Categories: {total_categories}")
        self.stdout.write(f"Total Subcategories: {total_subcategories}")
