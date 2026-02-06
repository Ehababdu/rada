import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useToast } from './use-toast';
import { SharedData } from '@/types';

export const useAppNotifications = (): void => {
    const { props } = usePage<SharedData>();
    const { toast } = useToast();
    const user = props?.auth?.user;
    const flash = props?.flash;

    // Handle Flash Messages (Inertia)
    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast(flash.success, { variant: 'success' });
        }
        if (flash.error) {
            toast(flash.error, { variant: 'destructive' });
        }
        if (flash.warning) {
            toast(flash.warning, { variant: 'warning' });
        }
        if (flash.info) {
            toast(flash.info, { variant: 'info' });
        }
    }, [flash, toast]);

    // Handle Real-time Notifications (Echo)
    useEffect(() => {
        if (!user) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const echo = (window as any).Echo;
        if (!echo) return;

        const channelName = `alerts.${user.id}`;
        const channel = echo.private(channelName);

        const handler = (payload: any) => {
            const title = payload.title ?? payload.message ?? 'Notification';
            const description = payload.description ?? (payload.title ? payload.message : '');
            const type = payload.type ?? payload.variant ?? 'default';

            toast({
                title,
                description,
                variant: type as any,
            });
        };

        const eventName = 'alert.created';
        channel.listen(eventName, handler);

        return () => {
            try {
                channel.stopListening(eventName, handler);
            } catch (e) {
                // Ignore cleanup errors
            }
        };
    }, [user, toast]);
};

export default useAppNotifications;
