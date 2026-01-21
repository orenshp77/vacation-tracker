import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export const uploadImage = async (file: UploadedFile): Promise<string> => {
    const ext = path.extname(file.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error('Invalid file type. Allowed: jpg, jpeg, png, gif, webp');
    }

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const uniqueName = `${uuidv4()}${ext}`;
    const uploadPath = path.join(UPLOAD_DIR, uniqueName);

    await file.mv(uploadPath);

    return uniqueName;
};

export const deleteImage = (imageName: string): void => {
    if (!imageName) return;

    const imagePath = path.join(UPLOAD_DIR, imageName);

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

export const getImagePath = (imageName: string): string => {
    return path.join(UPLOAD_DIR, imageName);
};
