import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

declare global {
    interface Window {
        Echo?: any;
    }
}

export const useNotifications = (): void => {
    const { props } = usePage();
    const user = props?.auth?.user;

    useEffect(() => {
        if (!user) return;
        if (typeof window === 'undefined' || !window.Echo) return;

        const channelName = `alerts.${user.id}`;
        const channel = window.Echo.private(channelName);

        const handler = (payload: any) => {
            const title = payload.title ?? 'Notification';
            const description = payload.message ?? payload.description ?? '';
            const type = payload.type ?? 'default';

            switch (type) {
                case 'success':
                    toast.success(title, { description });
                    break;
                case 'info':
                    toast.info(title, { description });
                    break;
                case 'warning':
                    toast.warning(title, { description });
                    break;
                case 'error':
                case 'destructive':
                    toast.error(title, { description });
                    break;
                default:
                    toast(title, { description });
            }
        };

        // Listen for the broadcasted event. Event's broadcastAs() returns 'alert.created'
        channel.listen('alert.created', handler);

        return () => {
            try {
                channel.stopListening('alert.created', handler);
                channel.leave();
            } catch (e) {
                // ignore cleanup errors in edge cases
            }
        };
    }, [user]);
};

export default useNotifications;
