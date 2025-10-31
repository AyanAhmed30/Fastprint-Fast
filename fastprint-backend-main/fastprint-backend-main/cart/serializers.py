from rest_framework import serializers
from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for CartItem model.
    Handles all cart item data including JSON fields.
    """
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = [
            'id',
            'user_email',
            'preview_form',
            'preview_project',
            'first_name',
            'last_name',
            'company',
            'address',
            'apt_floor',
            'country',
            'state',
            'city',
            'postal_code',
            'phone_number',
            'account_type',
            'has_resale_cert',
            'shipping_rate',
            'tax',
            'tax_rate',
            'tax_reason',
            'courier_name',
            'estimated_delivery',
            'selected_service',
            'product_quantity',
            'product_price',
            'subtotal',
            'display_total_cost',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else None
    
    def create(self, validated_data):
        # Set user from request context
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)