import { STORAGE_KEYS } from "../constants";

/**
 * Local storage utilities
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },
};

/**
 * Auth token utilities
 */
export const authStorage = {
  getToken: () => {
    return storage.get(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token) => {
    return storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: () => {
    return storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  hasToken: () => {
    return storage.has(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser: () => {
    return storage.get(STORAGE_KEYS.AUTH_USER);
  },

  setUser: (user) => {
    return storage.set(STORAGE_KEYS.AUTH_USER, user);
  },

  removeUser: () => {
    return storage.remove(STORAGE_KEYS.AUTH_USER);
  },

  clearAuth: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};