from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import User


class Category(models.Model):
    """
    Product Category Model
    """
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=120, unique=True, blank=True)
    description = models.TextField(_('description'), blank=True)
    image = models.ImageField(_('image'), upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class SubCategory(models.Model):
    """
    Product SubCategory Model
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories',
        verbose_name=_('category')
    )
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=120, unique=True, blank=True)
    description = models.TextField(_('description'), blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'subcategories'
        verbose_name = _('subcategory')
        verbose_name_plural = _('subcategories')
        ordering = ['category', 'name']
        unique_together = [['category', 'name']]
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.category.name}-{self.name}")
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.category.name} > {self.name}"


class Product(models.Model):
    """
    Product Model
    """
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        INACTIVE = 'INACTIVE', _('Inactive')
        OUT_OF_STOCK = 'OUT_OF_STOCK', _('Out of Stock')
    
    name = models.CharField(_('name'), max_length=255)
    slug = models.SlugField(_('slug'), max_length=300, unique=True, blank=True)
    description = models.TextField(_('description'))
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('category')
    )
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('subcategory'),
        blank=True,
        null=True
    )
    price = models.DecimalField(
        _('price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    discount_percentage = models.DecimalField(
        _('discount percentage'),
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    stock = models.PositiveIntegerField(_('stock quantity'), default=0)
    sku = models.CharField(_('SKU'), max_length=100, unique=True, blank=True, null=True)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    
    # Additional product details
    brand = models.CharField(_('brand'), max_length=100, blank=True)
    specifications = models.JSONField(_('specifications'), default=dict, blank=True)
    
    # SEO fields
    meta_title = models.CharField(_('meta title'), max_length=255, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Ratings and reviews
    average_rating = models.DecimalField(
        _('average rating'),
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_reviews = models.PositiveIntegerField(_('total reviews'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['price']),
            models.Index(fields=['average_rating']),
            models.Index(fields=['created_at']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # Auto-update status based on stock
        if self.stock == 0:
            self.status = self.Status.OUT_OF_STOCK
        elif self.status == self.Status.OUT_OF_STOCK and self.stock > 0:
            self.status = self.Status.ACTIVE
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def discounted_price(self):
        """Calculate discounted price"""
        if self.discount_percentage > 0:
            discount_amount = (self.price * self.discount_percentage) / 100
            return self.price - discount_amount
        return self.price
    
    @property
    def is_in_stock(self):
        return self.stock > 0
    
    @property
    def is_low_stock(self):
        return 0 < self.stock <= 10


class ProductImage(models.Model):
    """
    Product Image Model - Multiple images per product
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('product')
    )
    image = models.ImageField(_('image'), upload_to='products/')
    alt_text = models.CharField(_('alt text'), max_length=255, blank=True)
    is_primary = models.BooleanField(_('primary image'), default=False)
    display_order = models.PositiveIntegerField(_('display order'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        db_table = 'product_images'
        verbose_name = _('product image')
        verbose_name_plural = _('product images')
        ordering = ['product', 'display_order', '-is_primary']
        indexes = [
            models.Index(fields=['product', 'is_primary']),
        ]
    
    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product.name} - Image {self.display_order}"


class Review(models.Model):
    """
    Product Review Model
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('product')
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('user')
    )
    rating = models.PositiveIntegerField(
        _('rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(_('title'), max_length=200, blank=True)
    comment = models.TextField(_('comment'))
    images = models.JSONField(_('review images'), default=list, blank=True)
    is_verified_purchase = models.BooleanField(_('verified purchase'), default=False)
    helpful_count = models.PositiveIntegerField(_('helpful count'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        verbose_name = _('review')
        verbose_name_plural = _('reviews')
        ordering = ['-created_at']
        unique_together = [['product', 'user']]  # One review per user per product
        indexes = [
            models.Index(fields=['product', 'rating']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update product average rating and total reviews
        self.update_product_rating()
    
    def update_product_rating(self):
        """Update product's average rating and total reviews"""
        from django.db.models import Avg, Count
        stats = Review.objects.filter(product=self.product).aggregate(
            avg_rating=Avg('rating'),
            total_reviews=Count('id')
        )
        self.product.average_rating = stats['avg_rating'] or 0
        self.product.total_reviews = stats['total_reviews'] or 0
        self.product.save(update_fields=['average_rating', 'total_reviews'])
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"
