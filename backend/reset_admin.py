from accounts.models import User

# Get or create admin user
admin_email = "admin@apnishop.com"
admin_password = "Admin@123"

try:
    admin = User.objects.get(email=admin_email)
    admin.set_password(admin_password)
    admin.is_staff = True
    admin.is_superuser = True
    admin.role = User.Role.ADMIN
    admin.save()
    print(f"✓ Admin user password reset successfully!")
    print(f"  Email: {admin_email}")
    print(f"  Password: {admin_password}")
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
    print(f"✓ Admin user created successfully!")
    print(f"  Email: {admin_email}")
    print(f"  Password: {admin_password}")
