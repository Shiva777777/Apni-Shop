import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from accounts.models import User

admin = User.objects.filter(is_staff=True, is_superuser=True).first()
if admin:
    print(f"Admin exists: {admin.email}")
else:
    print("No admin found - creating new admin...")
    User.objects.create_superuser(
        email='admin@apnishop.com',
        username='admin',
        password='Admin@12345',
        first_name='Admin',
        last_name='User'
    )
    print("Admin created!")
    print("Email: admin@apnishop.com")
    print("Password: Admin@12345")
