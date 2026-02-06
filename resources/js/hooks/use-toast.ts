import { toast } from 'sonner';

export interface ToastOptions {
    duration?: number;
    position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    pauseOnHover?: boolean;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const showToast = (
        messageOrOptions:
            | string
            | {
                title: string;
                description?: string;
                action?: ToastOptions['action'];
                variant?: ToastOptions['variant'];
            },
        options?: ToastOptions,
    ) => {
        const isString = typeof messageOrOptions === 'string';
        const title = isString ? messageOrOptions : messageOrOptions.title;
        const description = isString ? options?.description : messageOrOptions.description;
        const action = isString ? options?.action : messageOrOptions.action;
        const variant = isString ? options?.variant : (messageOrOptions.variant || 'default');

        const sonnerOptions = {
            ...options,
            description,
            action,
        };

        switch (variant) {
            case 'success':
                toast.success(title, sonnerOptions);
                break;
            case 'destructive':
                toast.error(title, sonnerOptions);
                break;
            case 'warning':
                toast.warning(title, sonnerOptions);
                break;
            case 'info':
                toast.info(title, sonnerOptions);
                break;
            default:
                toast(title, sonnerOptions);
        }
    };

    return { toast: showToast };
};
