#!/usr/bin/env python
"""
Test script to verify Category and SubCategory API endpoints
Run: python manage.py shell < test_category_api.py
Or: python test_category_api.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from products.models import Category, SubCategory
from accounts.models import User
from rest_framework.test import APIClient
from django.test import Client

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_categories_data():
    """Check if categories are populated in database"""
    print_section("DATABASE CATEGORIES")
    
    categories = Category.objects.all()
    print(f"\nTotal Categories: {categories.count()}")
    
    for cat in categories:
        subs = cat.subcategories.all()
        print(f"\n📁 {cat.name}")
        print(f"   Description: {cat.description[:50]}..." if cat.description else "   Description: N/A")
        print(f"   Active: {cat.is_active}")
        print(f"   SubCategories: {subs.count()}")
        for sub in subs:
            print(f"      📂 {sub.name} (Active: {sub.is_active})")

def test_api_endpoints():
    """Test API endpoints"""
    print_section("API ENDPOINTS TEST")
    
    client = APIClient()
    
    # Test getting categories without authentication
    print("\n1. GET /api/admin/categories/ (No Auth)")
    response = client.get('/api/admin/categories/')
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 401:
        print("   ❌ Unauthorized - Need authentication")
    elif response.status_code == 200:
        print(f"   ✅ Success - {len(response.json())} categories")
    else:
        print(f"   Error: {response.data}")
    
    # Create admin user if not exists
    admin_user = User.objects.filter(is_admin=True).first()
    if not admin_user:
        print("\n   Creating test admin user...")
        admin_user = User.objects.create_user(
            email='admin@test.com',
            password='testadmin123',
            is_admin=True
        )
        admin_user.first_name = "Test"
        admin_user.last_name = "Admin"
        admin_user.save()
        print(f"   Created: {admin_user.email}")
    
    # Test with authentication
    print(f"\n2. GET /api/admin/categories/ (With Auth - {admin_user.email})")
    client.force_authenticate(user=admin_user)
    response = client.get('/api/admin/categories/')
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Success - {len(data)} categories returned")
        if data:
            print(f"   First Category: {data[0].get('name', 'N/A')}")
    else:
        print(f"   Error: {response.data}")
    
    # Test subcategories endpoint
    print(f"\n3. GET /api/admin/subcategories/ (With Auth)")
    response = client.get('/api/admin/subcategories/')
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Success - {len(data)} subcategories returned")
    else:
        print(f"   Error: {response.data}")
    
    # Test filtering subcategories by category
    if Category.objects.exists():
        cat_id = Category.objects.first().id
        print(f"\n4. GET /api/admin/subcategories/?category={cat_id} (Filter)")
        response = client.get(f'/api/admin/subcategories/?category={cat_id}')
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success - {len(data)} subcategories for category {cat_id}")
    
    # Test public API (product view)
    print(f"\n5. GET /api/products/categories/ (Public)")
    client.force_authenticate(user=None)  # Remove auth
    response = client.get('/api/products/categories/')
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Success - {len(data)} active categories")
    else:
        print(f"   Error: {response.data}")

def run_all_tests():
    """Run all tests"""
    test_categories_data()
    test_api_endpoints()
    
    print_section("TEST SUMMARY")
    print("\n✅ All tests completed!")
    print("\nAPI Endpoints:")
    print("  - GET  /api/admin/categories/           (List all)")
    print("  - POST /api/admin/categories/           (Create)")
    print("  - GET  /api/admin/categories/{id}/      (Detail)")
    print("  - PUT  /api/admin/categories/{id}/      (Update)")
    print("  - DELETE /api/admin/categories/{id}/    (Delete)")
    print("\n  - GET  /api/admin/subcategories/       (List all)")
    print("  - POST /api/admin/subcategories/       (Create)")
    print("  - GET  /api/admin/subcategories/{id}/  (Detail)")
    print("  - PUT  /api/admin/subcategories/{id}/  (Update)")
    print("  - DELETE /api/admin/subcategories/{id}/ (Delete)")

if __name__ == '__main__':
    run_all_tests()
