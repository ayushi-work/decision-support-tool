/**
 * Utility functions for the recommendation system
 * Provides common helper functions used across modules
 */

/**
 * Gets a nested value from an object using dot notation
 * @param {Object} obj - The object to search in
 * @param {string} path - Dot-separated path (e.g., 'cost.value')
 * @returns {*} The value at the path, or undefined if not found
 */
export function getNestedValue(obj, path) {
  if (!obj || typeof obj !== 'object' || !path) {
    return undefined;
  }
  
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
}

/**
 * Sets a nested value in an object using dot notation
 * @param {Object} obj - The object to modify
 * @param {string} path - Dot-separated path (e.g., 'cost.value')
 * @param {*} value - The value to set
 */
export function setNestedValue(obj, path, value) {
  if (!obj || typeof obj !== 'object' || !path) {
    return;
  }

  const keys = path.split('.');
  const lastKey = keys.pop();
  
  // Navigate to the parent object, creating nested objects as needed
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}

/**
 * Deep clones an object to avoid mutation
 * @param {*} obj - The object to clone
 * @returns {*} Deep copy of the object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * Safely parses a numeric value
 * @param {*} value - The value to parse
 * @returns {number|null} Parsed number or null if invalid
 */
export function safeParseNumber(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is considered empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Rounds a number to a specified number of decimal places
 * @param {number} num - The number to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Rounded number
 */
export function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Clamps a number between min and max values
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value, or 0 if array is empty
 */
export function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  
  const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n));
  if (validNumbers.length === 0) {
    return 0;
  }
  
  return validNumbers.reduce((sum, num) => sum + num, 0) / validNumbers.length;
}

/**
 * Finds the median value in an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Median value, or 0 if array is empty
 */
export function median(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  
  const validNumbers = numbers
    .filter(n => typeof n === 'number' && !isNaN(n))
    .sort((a, b) => a - b);
    
  if (validNumbers.length === 0) {
    return 0;
  }
  
  const middle = Math.floor(validNumbers.length / 2);
  
  if (validNumbers.length % 2 === 0) {
    return (validNumbers[middle - 1] + validNumbers[middle]) / 2;
  } else {
    return validNumbers[middle];
  }
}

/**
 * Generates a unique ID string
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random ID string
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Creates a formatted timestamp string
 * @param {Date} date - Date object (default: current date)
 * @returns {string} ISO timestamp string
 */
export function createTimestamp(date = new Date()) {
  return date.toISOString();
}

/**
 * Validates that a value is within expected bounds
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if value is within bounds
 */
export function isWithinBounds(value, min, max) {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

/**
 * Sanitizes a string for safe display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Formats a number as a percentage
 * @param {number} value - Value between 0 and 1
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  return `${roundToDecimals(value * 100, decimals)}%`;
}

/**
 * Formats a number with thousand separators
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return value.toLocaleString();
}