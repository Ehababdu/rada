declare module 'react-filepond' {
    export interface FilePondFile {
        id: string;
        serverId: string;
        origin: number;
        status: number;
        file: File;
        fileExtension: string;
        fileSize: number;
        fileType: string;
        filename: string;
        filenameWithoutExtension: string;
    }

    export interface FilePondProps {
        files?: File[];
        allowMultiple?: boolean;
        acceptedFileTypes?: string[];
        onupdatefiles?: (fileItems: FilePondFile[]) => void;
        [key: string]: unknown;
    }

    export class FilePond extends React.Component<FilePondProps> {}

    export function registerPlugin(...plugins: unknown[]): void;
}

declare module 'filepond-plugin-image-preview';
declare module 'filepond-plugin-file-validate-type';
declare module 'filepond-plugin-file-validate-size';
declare module 'filepond-plugin-image-exif-orientation';