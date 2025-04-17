// lib/storage.ts
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOAD_DIR)) {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export const storage = {
  async upload(file: File, fileName: string) {
    // Create subdirectories if they don't exist
    const filePath = path.join(UPLOAD_DIR, fileName);
    const fileDir = path.dirname(filePath);
    
    if (!existsSync(fileDir)) {
      await mkdir(fileDir, { recursive: true });
    }

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return {
      url: `/api/documents/download/${fileName}` 
    };
  },

  async delete(fileName: string) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    try {
      await unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  },
  async getFilePath(filePath: string) {
    // Convert storagePath to filesystem path
    const fullPath = path.join(UPLOAD_DIR, filePath);
    
    // Verify file exists
    if (!existsSync(fullPath)) {
      throw new Error('File not found');
    }
    
    // Return both the full path and API route
    return {
      absolutePath: fullPath,
      apiUrl: `/api/documents/file/${filePath}`
    };
  }
  // async getFilePath(fileName: string) {
  //   return path.join(UPLOAD_DIR, fileName);
  // }
};