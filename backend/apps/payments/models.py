from django.db import models
from django.utils.translation import gettext_lazy as _
from orders.models import Order


class Payment(models.Model):
    """
    Payment Transaction Model
    """
    class PaymentGateway(models.TextChoices):
        RAZORPAY = 'RAZORPAY', _('Razorpay')
        STRIPE = 'STRIPE', _('Stripe')
        COD = 'COD', _('Cash on Delivery')
    
    class PaymentStatus(models.TextChoices):
        INITIATED = 'INITIATED', _('Initiated')
        PENDING = 'PENDING', _('Pending')
        SUCCESS = 'SUCCESS', _('Success')
        FAILED = 'FAILED', _('Failed')
        REFUNDED = 'REFUNDED', _('Refunded')
    
    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        related_name='payments',
        verbose_name=_('order')
    )
    gateway = models.CharField(
        _('payment gateway'),
        max_length=20,
        choices=PaymentGateway.choices
    )
    transaction_id = models.CharField(_('transaction ID'), max_length=255, unique=True)
    gateway_order_id = models.CharField(_('gateway order ID'), max_length=255, blank=True)
    gateway_payment_id = models.CharField(_('gateway payment ID'), max_length=255, blank=True)
    gateway_signature = models.CharField(_('gateway signature'), max_length=255, blank=True)
    
    amount = models.DecimalField(
        _('amount'),
        max_digits=10,
        decimal_places=2
    )
    currency = models.CharField(_('currency'), max_length=3, default='INR')
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.INITIATED
    )
    
    # Additional payment details
    payment_method = models.CharField(_('payment method'), max_length=50, blank=True)
    card_last4 = models.CharField(_('card last 4 digits'), max_length=4, blank=True)
    upi_id = models.CharField(_('UPI ID'), max_length=100, blank=True)
    
    # Response data from gateway
    gateway_response = models.JSONField(_('gateway response'), default=dict, blank=True)
    error_message = models.TextField(_('error message'), blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = _('payment')
        verbose_name_plural = _('payments')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['order', 'status']),
            models.Index(fields=['gateway', 'status']),
        ]
    
    def __str__(self):
        return f"Payment {self.transaction_id} - {self.order.order_number} ({self.status})"
    
    def generate_transaction_id(self):
        """Generate unique transaction ID"""
        import uuid
        return f"TXN-{uuid.uuid4().hex[:16].upper()}"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = self.generate_transaction_id()
        super().save(*args, **kwargs)
