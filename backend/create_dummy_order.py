
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from accounts.models import User
from products.models import Product
from orders.models import Order, OrderItem, Address
from decimal import Decimal

def create_order():
    user = User.objects.get(email='admin@apnishop.com')
    product = Product.objects.first()
    
    # Create address
    address, _ = Address.objects.get_or_create(
        user=user,
        full_name="Admin Test",
        phone="1234567890",
        address_line1="123 Admin Lane",
        city="Admin City",
        state="Admin State",
        pincode="110001"
    )
    
    # Create order
    order = Order.objects.create(
        user=user,
        subtotal=product.discounted_price,
        total_amount=product.discounted_price,
        shipping_address=address,
        payment_method='COD',
        status='PENDING'
    )
    
    # Create order item
    OrderItem.objects.create(
        order=order,
        product=product,
        product_name=product.name,
        product_price=product.discounted_price,
        quantity=1,
        total_price=product.discounted_price
    )
    
    print(f"Created order: {order.order_number}")

if __name__ == "__main__":
    create_order()
