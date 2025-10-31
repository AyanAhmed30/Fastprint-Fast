from django.db import models
from django.conf import settings


class CartItem(models.Model):
    """
    Stores cart items with all checkout form data.
    Each item belongs to a user and contains all information
    needed to complete the purchase.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    
    # Project and form data (stored as JSON strings to preserve structure)
    preview_form = models.TextField(help_text="JSON string of form data")
    preview_project = models.TextField(help_text="JSON string of project data")
    
    # Shipping address information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255)
    apt_floor = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=10)
    state = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=50)
    
    # Account and shipping details
    account_type = models.CharField(max_length=20, default='individual')
    has_resale_cert = models.BooleanField(default=False)
    
    # Shipping rate information
    shipping_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    tax = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    tax_rate = models.CharField(max_length=20, blank=True, null=True)
    tax_reason = models.TextField(blank=True, null=True)
    courier_name = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery = models.CharField(max_length=100, blank=True, null=True)
    
    # Selected service (stored as JSON)
    selected_service = models.JSONField(null=True, blank=True)
    
    # Product information
    product_quantity = models.PositiveIntegerField(default=1)
    product_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    display_total_cost = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
    
    def __str__(self):
        return f"Cart Item {self.id} - {self.user.email}"