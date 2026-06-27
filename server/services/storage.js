const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

/**
 * Storage Service wrapper for Cloudinary
 */
class StorageService {
  constructor() {
    this.isConfigured = !!process.env.CLOUDINARY_URL || 
                        (process.env.CLOUDINARY_CLOUD_NAME && 
                         process.env.CLOUDINARY_API_KEY && 
                         process.env.CLOUDINARY_API_SECRET);
                         
    if (this.isConfigured && !process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  /**
   * Upload a file to Cloudinary
   * @param {string} filePath - Local path to the file
   * @param {string} resourceType - 'auto', 'image', 'video', 'raw'
   * @returns {Promise<string>} - Public secure URL
   */
  async uploadFile(filePath, resourceType = 'auto') {
    if (!this.isConfigured) {
      console.warn('⚠️ Cloudinary is not configured. Storing locally instead.');
      // Fallback for when Cloudinary isn't configured yet (return relative path)
      // This allows the app to not break while waiting for the user to add keys
      const fileName = path.basename(filePath);
      return `/outputs/videos/${fileName}`;
    }

    try {
      console.log(`Uploading ${filePath} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        folder: 'preplit_videos',
      });
      console.log(`✅ Upload complete: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
  }
}

module.exports = new StorageService();
