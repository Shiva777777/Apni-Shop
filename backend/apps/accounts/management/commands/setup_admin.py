from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Setup or reset admin user credentials'

    def handle(self, *args, **options):
        admin_email = "admin@apnishop.com"
        admin_password = "Admin@123"
        
        try:
            admin = User.objects.get(email=admin_email)
            admin.set_password(admin_password)
            admin.is_staff = True
            admin.is_superuser = True
            admin.role = User.Role.ADMIN
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Admin user password reset successfully!'))
            self.stdout.write(f'  Email: {admin_email}')
            self.stdout.write(f'  Password: {admin_password}')
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
            self.stdout.write(self.style.SUCCESS(f'✓ Admin user created successfully!'))
            self.stdout.write(f'  Email: {admin_email}')
            self.stdout.write(f'  Password: {admin_password}')
