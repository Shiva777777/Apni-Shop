import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from accounts.models import User

# Check admin user
admin = User.objects.filter(email='admin@apnishop.com').first()
if admin:
    print(f"Admin User Found:")
    print(f"Email: {admin.email}")
    print(f"Role: {admin.role}")
    print(f"Is Staff: {admin.is_staff}")
    print(f"Is Superuser: {admin.is_superuser}")
    
    # Update role to ADMIN if needed
    if admin.role != 'ADMIN':
        admin.role = 'ADMIN'
        admin.save()
        print("✓ Role updated to ADMIN")
else:
    print("Admin user not found!")
