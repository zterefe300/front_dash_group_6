// Image Upload API
import { API_BASE_URL } from './config';
import type { ImageUploadResponse } from './types';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const uploadApi = {
  /**
   * Upload an image/document file
   * @param file - File to upload
   * @returns Uploaded file metadata with accessible URL
   */
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload file');
    }

    const data: ImageUploadResponse = await response.json();
    const normalizedUrl = data.url?.startsWith('http')
      ? data.url
      : `${API_ORIGIN}${data.url.startsWith('/') ? '' : '/'}${data.url}`;

    return { ...data, url: normalizedUrl };
  },
};
