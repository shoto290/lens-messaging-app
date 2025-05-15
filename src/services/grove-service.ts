import { StorageClient } from "@lens-chain/storage-client";

// Create a StorageClient instance
const storageClient = StorageClient.create();

/**
 * Uploads an image to Grove storage and returns the URI
 * @param file The image file to upload
 * @returns The URI of the uploaded image
 */
const uploadImage = async (file: File): Promise<string> => {
  try {
    // Upload the file to Grove storage
    const result = await storageClient.uploadFile(file);
    return result.uri;
  } catch (error) {
    console.error("Error uploading image to Grove:", error);
    throw error;
  }
};

/**
 * Uploads JSON data to Grove storage and returns the URI
 * @param data The data to upload as JSON
 * @returns The URI of the uploaded JSON
 */
const uploadJson = async <T extends Record<string, unknown>>(
  data: T
): Promise<string> => {
  try {
    // Upload the data as JSON to Grove storage
    const result = await storageClient.uploadAsJson(data);
    return result.uri;
  } catch (error) {
    console.error("Error uploading JSON to Grove:", error);
    throw error;
  }
};

export const groveService = {
  uploadImage,
  uploadJson,
};
