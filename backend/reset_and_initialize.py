#!/usr/bin/env python
"""
MANUAL DATA RESET AND INITIALIZATION
Run this script manually whenever you want to reset and reinitialize data:
    docker exec newapnishop-backend-1 python reset_and_initialize.py

OR from local:
    python reset_and_initialize.py
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
from orders.models import Order, OrderItem, Cart, CartItem, Address
from wishlist.models import Wishlist
from decimal import Decimal


def reset_database():
    """Clear all data (optional - use with caution!)"""
    print("\n⚠️  WARNING: This will DELETE ALL existing data!")
    response = input("Are you sure you want to continue? (yes/no): ")
    
    if response.lower() != 'yes':
        print("❌ Operation cancelled.")
        return False
    
    print("\n🗑️  Clearing database...")
    
    # Delete in order to avoid foreign key constraints
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    CartItem.objects.all().delete()
    Cart.objects.all().delete()
    Address.objects.all().delete()
    Wishlist.objects.all().delete()
    Product.objects.all().delete()
    SubCategory.objects.all().delete()
    Category.objects.all().delete()
    
    # Keep superusers, delete other users
    User.objects.filter(is_superuser=False).delete()
    
    print("✅ Database cleared!")
    return True


def initialize_fresh_data():
    """Initialize fresh data"""
    print("\n🚀 Initializing fresh data...")
    
    # Import and run the initialization script
    from initialize_data import run_initialization
    run_initialization()


def main():
    print("\n" + "="*60)
    print("🔄 APNI SHOP - DATA RESET & INITIALIZATION")
    print("="*60)
    
    print("\nOptions:")
    print("1. Initialize data (keep existing)")
    print("2. Reset ALL data and reinitialize (DANGER!)")
    print("3. Cancel")
    
    choice = input("\nEnter your choice (1/2/3): ")
    
    if choice == '1':
        print("\n✅ Running initialization (keeping existing data)...")
        initialize_fresh_data()
    elif choice == '2':
        if reset_database():
            initialize_fresh_data()
    else:
        print("\n❌ Operation cancelled.")
    
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
