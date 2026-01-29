import { toast } from 'sonner';

export interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    variant?: 'default' | 'destructive' | 'success';
    pauseOnHover?: boolean;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const showToast = (messageOrOptions: string | { title: string; description?: string; action?: ToastOptions['action']; variant?: ToastOptions['variant'] }, options?: ToastOptions) => {
        if (typeof messageOrOptions === 'string') {
            // Legacy string-based toast
            const { variant = 'default', ...rest } = options || {};

            switch (variant) {
                case 'success':
                    toast.success(messageOrOptions, rest);
                    break;
                case 'destructive':
                    toast.error(messageOrOptions, rest);
                    break;
                default:
                    toast(messageOrOptions, rest);
            }
        } else {
            // New object-based toast with title and description
            const { title, description, action, variant = 'default' } = messageOrOptions;
            const toastOptions: any = {
                description,
                action,
            };

            switch (variant) {
                case 'success':
                    toast.success(title, toastOptions);
                    break;
                case 'destructive':
                    toast.error(title, toastOptions);
                    break;
                default:
                    toast(title, toastOptions);
            }
        }
    };

    return { toast: showToast };
};