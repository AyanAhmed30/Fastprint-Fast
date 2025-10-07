# serializers.py
from rest_framework import serializers
from .models import BookProject

class BookProjectSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = BookProject
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None