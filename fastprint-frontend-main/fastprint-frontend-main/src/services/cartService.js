import axios from 'axios';
import { BASE_URL } from './baseUrl';

const API_BASE = `${BASE_URL}api/cart`;

/**
 * Get authorization headers with token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Get all cart items for the current user
 */
export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_BASE}/items/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch cart items' };
  }
};

/**
 * Add a new cart item
 * @param {Object} cartData - Cart item data from shop form
 */
export const addCartItem = async (cartData) => {
  try {
    const response = await axios.post(`${API_BASE}/items/`, cartData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add cart item' };
  }
};

/**
 * Get a specific cart item by ID
 * @param {number} itemId - Cart item ID
 */
export const getCartItem = async (itemId) => {
  try {
    const response = await axios.get(`${API_BASE}/items/${itemId}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch cart item' };
  }
};

/**
 * Update a cart item
 * @param {number} itemId - Cart item ID
 * @param {Object} cartData - Updated cart item data
 */
export const updateCartItem = async (itemId, cartData) => {
  try {
    const response = await axios.put(`${API_BASE}/items/${itemId}/`, cartData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update cart item' };
  }
};

/**
 * Delete a cart item
 * @param {number} itemId - Cart item ID
 */
export const deleteCartItem = async (itemId) => {
  try {
    const response = await axios.delete(`${API_BASE}/items/${itemId}/`, {
      headers: getAuthHeaders(),
    });
    // Handle 204 No Content response - consider it success even if no data
    if (response.status === 204 || response.status === 200) {
      return { status: 'success', message: 'Cart item deleted successfully' };
    }
    return response.data || { status: 'success', message: 'Cart item deleted successfully' };
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete cart item' };
  }
};

/**
 * Clear all cart items for the current user
 */
export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_BASE}/items/`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 204 || response.status === 200) {
      return { status: 'success', message: 'Cart cleared successfully' };
    }
    return response.data || { status: 'success', message: 'Cart cleared successfully' };
  } catch (error) {
    throw error.response?.data || { error: 'Failed to clear cart' };
  }
};