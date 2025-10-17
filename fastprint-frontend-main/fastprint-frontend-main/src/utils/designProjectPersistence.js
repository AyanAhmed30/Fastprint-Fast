/**
 * Utility functions for persisting design project data
 * Handles saving and loading of form data, file uploads, and selections
 */

import {
  saveFileToIndexedDB as _saveFileToIndexedDB,
  getFileFromIndexedDB as _getFileFromIndexedDB,
  deleteFileFromIndexedDB as _deleteFileFromIndexedDB,
} from './indexedDbFileStore';

const DESIGN_PROJECT_STORAGE_KEY = 'designProjectData';

/**
 * Save design project data to localStorage
 * @param {Object} data - The design project data to save
 */
export const saveDesignProjectData = (data) => {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToSave = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(DESIGN_PROJECT_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving design project data:', error);
  }
};

/**
 * Load design project data from localStorage
 * @returns {Object|null} - The saved design project data or null if not found
 */
export const loadDesignProjectData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(DESIGN_PROJECT_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Check if data is not too old (e.g., 24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (data.timestamp && (Date.now() - data.timestamp) < maxAge) {
        return data;
      } else {
        // Clear old data
        localStorage.removeItem(DESIGN_PROJECT_STORAGE_KEY);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading design project data:', error);
    return null;
  }
};

/**
 * Clear design project data from localStorage
 */
export const clearDesignProjectData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(DESIGN_PROJECT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing design project data:', error);
  }
};

/**
 * Save file data (for uploaded files) with base64 content
 * @param {File} file - The file to save
 * @param {string} type - The type of file ('interior' or 'cover')
 * @returns {Promise<Object>} - File data object with base64 content
 */
export const saveFileData = async (file, type) => {
  if (!file) return null;
  
  // Try IndexedDB first (more durable and avoids localStorage quota problems)
  try {
    const key = `designFile_${type}_${Date.now()}`;
    await _saveFileToIndexedDB(key, file);
    return {
      idbKey: key,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      fileType: type,
    };
  } catch (err) {
    // Fall back to base64 stored in localStorage if IndexedDB fails
    try {
      const base64 = await fileToBase64(file);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        fileType: type,
        base64: base64,
      };
    } catch (error) {
      console.error('Error converting file to base64:', error);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        fileType: type,
      };
    }
  }
};

/**
 * Restore File object from a saved file record (which may reference IndexedDB or contain base64)
 * @param {Object} fileRecord
 * @returns {File|null}
 */
export const restoreFileFromRecord = async (fileRecord) => {
  if (!fileRecord) return null;
  if (fileRecord.idbKey) {
    try {
      const file = await _getFileFromIndexedDB(fileRecord.idbKey);
      return file;
    } catch (err) {
      // attempt fallback to base64 below
      console.warn('Failed to read file from IndexedDB', err);
    }
  }
  if (fileRecord.base64 && fileRecord.name && fileRecord.type) {
    try {
      return base64ToFile(fileRecord.base64, fileRecord.name, fileRecord.type);
    } catch (err) {
      console.warn('Failed to restore file from base64', err);
    }
  }
  return null;
};

/**
 * Convert File object to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Convert base64 string back to File object
 * @param {string} base64 - Base64 string
 * @param {string} filename - Original filename
 * @param {string} mimeType - MIME type
 * @returns {File} - File object
 */
export const base64ToFile = (base64, filename, mimeType) => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64.split(',')[1] || base64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    return null;
  }
};

/**
 * Check if a file exists and is valid
 * @param {Object} fileData - The file data to check
 * @returns {boolean} - Whether the file data is valid
 */
export const isValidFileData = (fileData) => {
  return fileData && fileData.name && fileData.size && fileData.type;
};

/**
 * Get the default form state
 * @returns {Object} - Default form state
 */
export const getDefaultFormState = () => ({
  trim_size_id: "",
  page_count: "",
  binding_id: "",
  interior_color_id: "",
  paper_type_id: "",
  cover_finish_id: "",
  quantity: 1,
});

/**
 * Get the default component state
 * @returns {Object} - Default component state
 */
export const getDefaultComponentState = () => ({
  fileError: "",
  selectedFile: null,
  uploadStatus: "idle",
  uploadProgress: 0,
  usedExpertCover: false,
  coverFile: null,
  coverFileError: "",
  coverPdfUrl: null,
  projectData: null,
  dropdowns: {},
  bindings: [],
  initialBindings: [],
  initialBindingsLoaded: false,
  loading: false,
  availableBindings: [],
  result: null,
  calculating: false,
  form: getDefaultFormState(),
});
