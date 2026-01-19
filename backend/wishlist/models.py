from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User
from products.models import Product


class Wishlist(models.Model):
    """
    User Wishlist Model
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='wishlist',
        verbose_name=_('user')
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'wishlists'
        verbose_name = _('wishlist')
        verbose_name_plural = _('wishlists')
    
    def __str__(self):
        return f"Wishlist for {self.user.email}"
    
    @property
    def total_items(self):
        return self.items.count()


class WishlistItem(models.Model):
    """
    Wishlist Item Model
    """
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('wishlist')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='wishlist_items',
        verbose_name=_('product')
    )
    added_at = models.DateTimeField(_('added at'), auto_now_add=True)
    
    class Meta:
        db_table = 'wishlist_items'
        verbose_name = _('wishlist item')
        verbose_name_plural = _('wishlist items')
        unique_together = [['wishlist', 'product']]
        ordering = ['-added_at']
        indexes = [
            models.Index(fields=['wishlist']),
        ]
    
    def __str__(self):
        return f"{self.product.name} in {self.wishlist.user.email}'s wishlist"
