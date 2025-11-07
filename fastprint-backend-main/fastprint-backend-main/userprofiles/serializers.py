# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'first_name',
            'last_name', 
            'username',
            'email',
            'password',
            'country',
            'state',
            'city',
            'postal_code',
            'address',
            'phone_number',
            'account_type',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
        }

    def validate_email(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_account_type(self, value):
        if value and value not in ['personal', 'business']:
            raise serializers.ValidationError("Account type must be 'personal' or 'business'.")
        return value

    def validate(self, data):
        if not data.get('email'):
            raise serializers.ValidationError({"email": "Email is required."})
        return data

    def create(self, validated_data):
        # Auto-fill username from email if missing
        email = validated_data['email']
        if 'username' not in validated_data or not validated_data['username'].strip():
            validated_data['username'] = email.split('@')[0]

        password = validated_data.pop('password', None)
        user = UserProfile(**validated_data)
        if password:
            user.password = make_password(password)
        else:
            user.set_unusable_password()  # Critical for OAuth users
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance