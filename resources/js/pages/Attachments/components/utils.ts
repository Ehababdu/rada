import { FileAudio, FileImage, FileText, FileVideo } from 'lucide-react';

export const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return FileImage;
    if (mimeType?.startsWith('video/')) return FileVideo;
    if (mimeType?.startsWith('audio/')) return FileAudio;
    return FileText;
};

export const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};
