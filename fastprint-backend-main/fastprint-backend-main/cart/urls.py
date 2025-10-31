from django.urls import path
from .views import CartItemListCreateView, CartItemDetailView

urlpatterns = [
    path('items/', CartItemListCreateView.as_view(), name='cart-item-list-create'),
    path('items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
]