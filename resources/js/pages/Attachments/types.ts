import { Martyr } from '@/types';

export interface AttachmentType {
    id: number;
    label: string;
    created_at: string;
    updated_at: string;
}

export interface Attachment {
    id: number;
    martyr_id: number;
    attachment_type: AttachmentType;
    attachment_type_label?: string;
    file_path: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface AttachmentStats {
    uploaded: Attachment[];
    notUploaded: Martyr[]; // Martyrs without attachments
    uploadedCount: number;
    notUploadedCount: number;
    total: number;
}
