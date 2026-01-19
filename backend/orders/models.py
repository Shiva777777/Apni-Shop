from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from accounts.models import User
from products.models import Product
import uuid


class Cart(models.Model):
    """
    Shopping Cart Model
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='cart',
        verbose_name=_('user')
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'carts'
        verbose_name = _('cart')
        verbose_name_plural = _('carts')
    
    def __str__(self):
        return f"Cart for {self.user.email}"
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())


class CartItem(models.Model):
    """
    Cart Item Model
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('cart')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name=_('product')
    )
    quantity = models.PositiveIntegerField(
        _('quantity'),
        default=1,
        validators=[MinValueValidator(1)]
    )
    added_at = models.DateTimeField(_('added at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'cart_items'
        verbose_name = _('cart item')
        verbose_name_plural = _('cart items')
        unique_together = [['cart', 'product']]
        indexes = [
            models.Index(fields=['cart']),
        ]
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def unit_price(self):
        return self.product.discounted_price
    
    @property
    def total_price(self):
        return self.unit_price * self.quantity


class Address(models.Model):
    """
    User Address Model
    """
    class AddressType(models.TextChoices):
        HOME = 'HOME', _('Home')
        OFFICE = 'OFFICE', _('Office')
        OTHER = 'OTHER', _('Other')
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses',
        verbose_name=_('user')
    )
    address_type = models.CharField(
        _('address type'),
        max_length=10,
        choices=AddressType.choices,
        default=AddressType.HOME
    )
    full_name = models.CharField(_('full name'), max_length=100)
    phone = models.CharField(_('phone number'), max_length=15)
    address_line1 = models.CharField(_('address line 1'), max_length=255)
    address_line2 = models.CharField(_('address line 2'), max_length=255, blank=True)
    city = models.CharField(_('city'), max_length=100)
    state = models.CharField(_('state'), max_length=100)
    pincode = models.CharField(_('pincode'), max_length=10)
    country = models.CharField(_('country'), max_length=100, default='India')
    is_default = models.BooleanField(_('default address'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'addresses'
        verbose_name = _('address')
        verbose_name_plural = _('addresses')
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_default']),
        ]
    
    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.full_name} - {self.address_type} ({self.city})"
    
    @property
    def full_address(self):
        parts = [
            self.address_line1,
            self.address_line2,
            self.city,
            self.state,
            self.pincode,
            self.country
        ]
        return ', '.join(filter(None, parts))


class Coupon(models.Model):
    """
    Discount Coupon Model
    """
    code = models.CharField(_('code'), max_length=50, unique=True)
    description = models.TextField(_('description'), blank=True)
    discount_type = models.CharField(
        _('discount type'),
        max_length=20,
        choices=[
            ('PERCENTAGE', 'Percentage'),
            ('FIXED', 'Fixed Amount')
        ],
        default='PERCENTAGE'
    )
    discount_value = models.DecimalField(
        _('discount value'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    min_order_value = models.DecimalField(
        _('minimum order value'),
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    max_discount = models.DecimalField(
        _('maximum discount'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    usage_limit = models.PositiveIntegerField(_('usage limit'), null=True, blank=True)
    used_count = models.PositiveIntegerField(_('used count'), default=0)
    valid_from = models.DateTimeField(_('valid from'))
    valid_to = models.DateTimeField(_('valid to'))
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'coupons'
        verbose_name = _('coupon')
        verbose_name_plural = _('coupons')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'valid_from', 'valid_to']),
        ]
    
    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'PERCENTAGE' else '₹'})"
    
    @property
    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_to and
            (self.usage_limit is None or self.used_count < self.usage_limit)
        )
    
    def calculate_discount(self, order_amount):
        """Calculate discount amount for given order amount"""
        if not self.is_valid or order_amount < self.min_order_value:
            return 0
        
        if self.discount_type == 'PERCENTAGE':
            discount = (order_amount * self.discount_value) / 100
            if self.max_discount:
                discount = min(discount, self.max_discount)
        else:
            discount = self.discount_value
        
        return min(discount, order_amount)


class Order(models.Model):
    """
    Order Model
    """
    class OrderStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        CONFIRMED = 'CONFIRMED', _('Confirmed')
        PROCESSING = 'PROCESSING', _('Processing')
        SHIPPED = 'SHIPPED', _('Shipped')
        DELIVERED = 'DELIVERED', _('Delivered')
        CANCELLED = 'CANCELLED', _('Cancelled')
        RETURNED = 'RETURNED', _('Returned')
    
    class PaymentMethod(models.TextChoices):
        COD = 'COD', _('Cash on Delivery')
        CARD = 'CARD', _('Credit/Debit Card')
        UPI = 'UPI', _('UPI')
        NET_BANKING = 'NET_BANKING', _('Net Banking')
        WALLET = 'WALLET', _('Wallet')
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        COMPLETED = 'COMPLETED', _('Completed')
        FAILED = 'FAILED', _('Failed')
        REFUNDED = 'REFUNDED', _('Refunded')
    
    order_number = models.CharField(_('order number'), max_length=50, unique=True, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name=_('user')
    )
    
    # Pricing
    subtotal = models.DecimalField(
        _('subtotal'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    discount_amount = models.DecimalField(
        _('discount amount'),
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    shipping_charge = models.DecimalField(
        _('shipping charge'),
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    tax_amount = models.DecimalField(
        _('tax amount'),
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    total_amount = models.DecimalField(
        _('total amount'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Address
    shipping_address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name=_('shipping address')
    )
    
    # Coupon
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        related_name='orders',
        verbose_name=_('coupon'),
        null=True,
        blank=True
    )
    
    # Payment
    payment_method = models.CharField(
        _('payment method'),
        max_length=20,
        choices=PaymentMethod.choices
    )
    payment_status = models.CharField(
        _('payment status'),
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    payment_id = models.CharField(_('payment ID'), max_length=255, blank=True)
    
    # Order Status
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )
    
    # Notes
    customer_notes = models.TextField(_('customer notes'), blank=True)
    admin_notes = models.TextField(_('admin notes'), blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    confirmed_at = models.DateTimeField(_('confirmed at'), null=True, blank=True)
    shipped_at = models.DateTimeField(_('shipped at'), null=True, blank=True)
    delivered_at = models.DateTimeField(_('delivered at'), null=True, blank=True)
    
    class Meta:
        db_table = 'orders'
        verbose_name = _('order')
        verbose_name_plural = _('orders')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['payment_status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    def generate_order_number(self):
        """Generate unique order number"""
        import random
        import string
        from django.utils import timezone
        
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"ORD-{timestamp}-{random_str}"
    
    def __str__(self):
        return f"Order {self.order_number} - {self.user.email}"


class OrderItem(models.Model):
    """
    Order Item Model
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('order')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name=_('product')
    )
    product_name = models.CharField(_('product name'), max_length=255)  # Snapshot
    product_price = models.DecimalField(
        _('product price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    quantity = models.PositiveIntegerField(
        _('quantity'),
        validators=[MinValueValidator(1)]
    )
    total_price = models.DecimalField(
        _('total price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    class Meta:
        db_table = 'order_items'
        verbose_name = _('order item')
        verbose_name_plural = _('order items')
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product']),
        ]
    
    def save(self, *args, **kwargs):
        # Save product snapshot
        if not self.product_name:
            self.product_name = self.product.name
        if not self.product_price:
            self.product_price = self.product.discounted_price
        if not self.total_price:
            self.total_price = self.product_price * self.quantity
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity} (Order: {self.order.order_number})"
