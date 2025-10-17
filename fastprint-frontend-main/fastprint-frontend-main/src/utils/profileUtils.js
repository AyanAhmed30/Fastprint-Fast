import { BASE_URL } from '@/services/baseUrl';

const API_BASE_URL = `${BASE_URL}api/userprofiles`;

/**
 * Check if a user has completed their account settings
 * @param {string} userEmail - The user's email
 * @param {string} token - The user's auth token
 * @returns {Promise<boolean>} - True if settings are completed, false otherwise
 */
export const hasCompletedAccountSettings = async (userEmail, token) => {
  if (!userEmail || !token) {
    return false;
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Try to get the user's profile using the authenticated endpoint
    const response = await fetch(`${API_BASE_URL}/profiles/me/`, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const profile = await response.json();
      return isProfileComplete(profile);
    }

    // Fallback: try searching by email if /me/ doesn't work
    const searchResponse = await fetch(`${API_BASE_URL}/profiles/?search=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (searchResponse.ok) {
      const data = await searchResponse.json();
      const profile = Array.isArray(data) ? data[0] : data;
      return profile ? isProfileComplete(profile) : false;
    }

    return false;
  } catch (error) {
    console.error('Error checking account settings completion:', error);
    return false;
  }
};

/**
 * Check if a profile is considered "complete" based on required fields
 * @param {Object} profile - The user profile object
 * @returns {boolean} - True if profile is complete
 */
const isProfileComplete = (profile) => {
  if (!profile) return false;

  // Define required fields for a complete profile
  const requiredFields = [
    'first_name',
    'last_name', 
    'country',
    'city',
    'account_type'
  ];

  // Check if all required fields are present and not empty
  return requiredFields.every(field => {
    const value = profile[field];
    return value && value.toString().trim() !== '';
  });
};

/**
 * Get user profile data
 * @param {string} userEmail - The user's email
 * @param {string} token - The user's auth token
 * @returns {Promise<Object|null>} - User profile or null if not found
 */
export const getUserProfile = async (userEmail, token) => {
  if (!userEmail || !token) {
    return null;
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Try authenticated endpoint first
    const response = await fetch(`${API_BASE_URL}/profiles/me/`, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      return await response.json();
    }

    // Fallback: search by email
    const searchResponse = await fetch(`${API_BASE_URL}/profiles/?search=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (searchResponse.ok) {
      const data = await searchResponse.json();
      return Array.isArray(data) ? data[0] : data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
