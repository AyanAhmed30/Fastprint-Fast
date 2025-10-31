from django.contrib import admin
from .models import CartItem


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product_quantity', 'subtotal', 'created_at']
    list_filter = ['created_at', 'account_type', 'country']
    search_fields = ['user__email', 'first_name', 'last_name', 'city']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Project Data', {
            'fields': ('preview_form', 'preview_project')
        }),
        ('Shipping Address', {
            'fields': (
                'first_name', 'last_name', 'company',
                'address', 'apt_floor', 'country', 'state',
                'city', 'postal_code', 'phone_number'
            )
        }),
        ('Account Details', {
            'fields': ('account_type', 'has_resale_cert')
        }),
        ('Shipping & Tax', {
            'fields': (
                'shipping_rate', 'tax', 'tax_rate', 'tax_reason',
                'courier_name', 'estimated_delivery', 'selected_service'
            )
        }),
        ('Product Details', {
            'fields': (
                'product_quantity', 'product_price',
                'subtotal', 'display_total_cost'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )