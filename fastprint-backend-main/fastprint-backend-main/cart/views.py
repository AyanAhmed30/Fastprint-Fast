from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CartItem
from .serializers import CartItemSerializer
import logging

logger = logging.getLogger(__name__)


class CartItemListCreateView(APIView):
    """
    GET: List all cart items for the authenticated user
    POST: Create a new cart item
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all cart items for the current user"""
        try:
            cart_items = CartItem.objects.filter(user=request.user)
            serializer = CartItemSerializer(cart_items, many=True)
            return Response({
                'status': 'success',
                'results': len(serializer.data),
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching cart items: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Failed to fetch cart items'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Create a new cart item"""
        try:
            serializer = CartItemSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                cart_item = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Cart item added successfully',
                    'data': CartItemSerializer(cart_item).data
                }, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Validation errors: {serializer.errors}")
                return Response({
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating cart item: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Failed to create cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartItemDetailView(APIView):
    """
    GET: Retrieve a specific cart item
    PUT/PATCH: Update a cart item
    DELETE: Delete a cart item
    """
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        """Get cart item and verify ownership"""
        cart_item = get_object_or_404(CartItem, pk=pk, user=user)
        return cart_item
    
    def get(self, request, pk):
        """Get a specific cart item"""
        try:
            cart_item = self.get_object(pk, request.user)
            serializer = CartItemSerializer(cart_item)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching cart item: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Cart item not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        """Update a cart item (full update)"""
        try:
            cart_item = self.get_object(pk, request.user)
            serializer = CartItemSerializer(cart_item, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Cart item updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating cart item: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Failed to update cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request, pk):
        """Update a cart item (partial update)"""
        try:
            cart_item = self.get_object(pk, request.user)
            serializer = CartItemSerializer(cart_item, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Cart item updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating cart item: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Failed to update cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, pk):
        """Delete a cart item"""
        try:
            cart_item = self.get_object(pk, request.user)
            cart_item.delete()
            return Response({
                'status': 'success',
                'message': 'Cart item deleted successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error deleting cart item: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Failed to delete cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)