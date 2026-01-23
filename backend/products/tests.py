from django.test import TestCase
from django.core.management import call_command
from django.utils.text import slugify
from rest_framework.test import APIClient
from products.models import Category, SubCategory, Product


class CategoryModelTest(TestCase):
    """
    Test suite for the Category model.
    """
    
    def setUp(self):
        """Set up test fixtures."""
        self.electronics = Category.objects.create(
            name='Electronics',
            description='Gadgets and electronic devices'
        )
        self.fashion = Category.objects.create(
            name='Fashion',
            description='Clothing and fashion accessories'
        )
    
    def test_category_creation(self):
        """Test that a category can be created."""
        self.assertTrue(Category.objects.filter(name='Electronics').exists())
        self.assertEqual(self.electronics.name, 'Electronics')
    
    def test_category_slug_auto_generation(self):
        """Test that slug is automatically generated from name."""
        self.assertEqual(self.electronics.slug, 'electronics')
        self.assertEqual(self.fashion.slug, 'fashion')
    
    def test_category_string_representation(self):
        """Test the string representation of a category."""
        self.assertEqual(str(self.electronics), 'Electronics')
    
    def test_category_is_active_default(self):
        """Test that categories are active by default."""
        self.assertTrue(self.electronics.is_active)
    
    def test_category_unique_name(self):
        """Test that category names are unique."""
        with self.assertRaises(Exception):
            Category.objects.create(name='Electronics')
    
    def test_category_ordering(self):
        """Test that categories are ordered by name."""
        Beauty = Category.objects.create(name='Beauty & Personal Care')
        categories = Category.objects.all()
        names = [cat.name for cat in categories]
        self.assertEqual(names, sorted(names))
    
    def test_category_timestamps(self):
        """Test that created_at and updated_at are set."""
        self.assertIsNotNone(self.electronics.created_at)
        self.assertIsNotNone(self.electronics.updated_at)
    
    def test_category_description(self):
        """Test that category description can be set."""
        self.assertEqual(self.electronics.description, 'Gadgets and electronic devices')
    
    def test_category_deactivation(self):
        """Test that a category can be deactivated."""
        self.electronics.is_active = False
        self.electronics.save()
        self.assertFalse(self.electronics.is_active)


class SubCategoryModelTest(TestCase):
    """
    Test suite for the SubCategory model.
    """
    
    def setUp(self):
        """Set up test fixtures."""
        self.electronics = Category.objects.create(
            name='Electronics',
            description='Electronic devices'
        )
        self.mobiles = SubCategory.objects.create(
            category=self.electronics,
            name='Mobiles',
            description='Mobile phones'
        )
        self.laptops = SubCategory.objects.create(
            category=self.electronics,
            name='Laptops',
            description='Laptop computers'
        )
    
    def test_subcategory_creation(self):
        """Test that a subcategory can be created."""
        self.assertTrue(SubCategory.objects.filter(name='Mobiles').exists())
        self.assertEqual(self.mobiles.category, self.electronics)
    
    def test_subcategory_slug_generation(self):
        """Test that slug is generated for subcategories."""
        self.assertIsNotNone(self.mobiles.slug)
        self.assertTrue(self.mobiles.slug.startswith('electronics-'))
    
    def test_subcategory_string_representation(self):
        """Test the string representation of a subcategory."""
        expected = f"{self.electronics.name} > {self.mobiles.name}"
        self.assertEqual(str(self.mobiles), expected)
    
    def test_subcategory_unique_together(self):
        """Test that subcategory name is unique within a category."""
        with self.assertRaises(Exception):
            SubCategory.objects.create(
                category=self.electronics,
                name='Mobiles'
            )
    
    def test_subcategory_same_name_different_category(self):
        """Test that same subcategory name can exist in different categories."""
        fashion = Category.objects.create(name='Fashion')
        shoes = SubCategory.objects.create(
            category=fashion,
            name='Shoes',
            description='Footwear'
        )
        self.assertEqual(shoes.category, fashion)
    
    def test_subcategory_cascade_delete(self):
        """Test that subcategories are deleted when category is deleted."""
        electronics_id = self.electronics.id
        subcategory_count_before = SubCategory.objects.filter(
            category__id=electronics_id
        ).count()
        self.assertEqual(subcategory_count_before, 2)
        
        self.electronics.delete()
        
        subcategory_count_after = SubCategory.objects.filter(
            category__id=electronics_id
        ).count()
        self.assertEqual(subcategory_count_after, 0)
    
    def test_subcategory_is_active_default(self):
        """Test that subcategories are active by default."""
        self.assertTrue(self.mobiles.is_active)
    
    def test_subcategory_ordering(self):
        """Test that subcategories are ordered by category and name."""
        fashion = Category.objects.create(name='Fashion')
        shoes = SubCategory.objects.create(category=fashion, name='Shoes')
        mens = SubCategory.objects.create(category=fashion, name='Mens')
        
        fashion_subs = SubCategory.objects.filter(category=fashion)
        names = [sub.name for sub in fashion_subs]
        self.assertEqual(names, sorted(names))


class CategoryManagementCommandTest(TestCase):
    """
    Test suite for the add_categories_command management command.
    """
    
    def test_add_categories_command(self):
        """Test that the management command creates all expected categories."""
        call_command('add_categories_command')
        
        # Assert correct number of categories
        self.assertEqual(Category.objects.count(), 11)
        
        # Assert correct number of subcategories
        self.assertEqual(SubCategory.objects.count(), 10)
    
    def test_all_main_categories_created(self):
        """Test that all main categories are created."""
        call_command('add_categories_command')
        
        expected_categories = [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Beauty & Personal Care',
            'Grocery',
            'Sports & Fitness',
            'Toys & Baby',
            'Automotive',
            'Books & Stationery',
            'Tools & Hardware',
            'Health & Wellness'
        ]
        
        for cat_name in expected_categories:
            self.assertTrue(
                Category.objects.filter(name=cat_name).exists(),
                f"Category '{cat_name}' was not created"
            )
    
    def test_electronics_subcategories(self):
        """Test that Electronics category has correct subcategories."""
        call_command('add_categories_command')
        
        electronics = Category.objects.get(name='Electronics')
        expected_subcats = ['Mobiles', 'Laptops', 'Accessories']
        
        for subcat_name in expected_subcats:
            self.assertTrue(
                SubCategory.objects.filter(
                    category=electronics,
                    name=subcat_name
                ).exists(),
                f"SubCategory '{subcat_name}' not found in Electronics"
            )
    
    def test_fashion_subcategories(self):
        """Test that Fashion category has correct subcategories."""
        call_command('add_categories_command')
        
        fashion = Category.objects.get(name='Fashion')
        expected_subcats = ['Men', 'Women', 'Kids', 'Footwear']
        
        for subcat_name in expected_subcats:
            self.assertTrue(
                SubCategory.objects.filter(
                    category=fashion,
                    name=subcat_name
                ).exists(),
                f"SubCategory '{subcat_name}' not found in Fashion"
            )
    
    def test_home_kitchen_subcategories(self):
        """Test that Home & Kitchen category has correct subcategories."""
        call_command('add_categories_command')
        
        home = Category.objects.get(name='Home & Kitchen')
        expected_subcats = ['Furniture', 'Appliances', 'Decor']
        
        for subcat_name in expected_subcats:
            self.assertTrue(
                SubCategory.objects.filter(
                    category=home,
                    name=subcat_name
                ).exists(),
                f"SubCategory '{subcat_name}' not found in Home & Kitchen"
            )
    
    def test_idempotent_command_execution(self):
        """Test that running the command twice doesn't create duplicates."""
        call_command('add_categories_command')
        count_first = Category.objects.count()
        
        call_command('add_categories_command')
        count_second = Category.objects.count()
        
        self.assertEqual(count_first, count_second)
        self.assertEqual(count_first, 11)


class CategoryAPITest(TestCase):
    """
    Test suite for the Category API endpoints.
    """
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        self.electronics = Category.objects.create(
            name='Electronics',
            description='Gadgets and more'
        )
        self.fashion = Category.objects.create(
            name='Fashion',
            description='Clothing and accessories'
        )
        self.home = Category.objects.create(
            name='Home & Kitchen',
            description='For your home'
        )
        
        # Create subcategories
        SubCategory.objects.create(category=self.electronics, name='Mobiles')
        SubCategory.objects.create(category=self.electronics, name='Laptops')
        SubCategory.objects.create(category=self.fashion, name='Men')
        SubCategory.objects.create(category=self.fashion, name='Women')
    
    def test_get_categories(self):
        """Test retrieving all categories."""
        response = self.client.get('/api/products/categories/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        
        category_names = [item['name'] for item in response.data]
        self.assertIn('Electronics', category_names)
        self.assertIn('Fashion', category_names)
        self.assertIn('Home & Kitchen', category_names)
    
    def test_get_single_category(self):
        """Test retrieving a single category by ID."""
        response = self.client.get(f'/api/products/categories/{self.electronics.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Electronics')
    
    def test_get_subcategories_for_category(self):
        """Test retrieving subcategories for a specific category."""
        response = self.client.get(
            f'/api/products/subcategories/?category_id={self.electronics.id}'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        
        subcategory_names = [item['name'] for item in response.data]
        self.assertIn('Mobiles', subcategory_names)
        self.assertIn('Laptops', subcategory_names)


class CategoryProductIntegrationTest(TestCase):
    """
    Test suite for category and product integration.
    """
    
    def setUp(self):
        """Set up test fixtures."""
        self.category = Category.objects.create(
            name='Electronics',
            description='Electronic devices'
        )
        self.subcategory = SubCategory.objects.create(
            category=self.category,
            name='Mobiles',
            description='Mobile phones'
        )
    
    def test_product_with_category_and_subcategory(self):
        """Test creating a product with category and subcategory."""
        product = Product.objects.create(
            name='iPhone 14',
            description='Latest iPhone',
            category=self.category,
            subcategory=self.subcategory,
            price=79999.00,
            stock=100
        )
        
        self.assertEqual(product.category, self.category)
        self.assertEqual(product.subcategory, self.subcategory)
        self.assertEqual(product.name, 'iPhone 14')
    
    def test_get_products_by_category(self):
        """Test retrieving products by category."""
        product1 = Product.objects.create(
            name='iPhone 14',
            description='Latest iPhone',
            category=self.category,
            subcategory=self.subcategory,
            price=79999.00,
            stock=100
        )
        product2 = Product.objects.create(
            name='Samsung Galaxy',
            description='Android phone',
            category=self.category,
            subcategory=self.subcategory,
            price=59999.00,
            stock=50
        )
        
        products = self.category.products.all()
        self.assertEqual(products.count(), 2)
        self.assertIn(product1, products)
        self.assertIn(product2, products)
    
    def test_get_products_by_subcategory(self):
        """Test retrieving products by subcategory."""
        product = Product.objects.create(
            name='iPhone 14',
            description='Latest iPhone',
            category=self.category,
            subcategory=self.subcategory,
            price=79999.00,
            stock=100
        )
        
        products = self.subcategory.products.all()
        self.assertEqual(products.count(), 1)
        self.assertIn(product, products)
    
    def test_subcategory_protect_on_delete(self):
        """Test that subcategories are protected on delete."""
        product = Product.objects.create(
            name='iPhone 14',
            description='Latest iPhone',
            category=self.category,
            subcategory=self.subcategory,
            price=79999.00,
            stock=100
        )
        
        # Should not be able to delete subcategory if it has products
        with self.assertRaises(Exception):
            self.subcategory.delete()
