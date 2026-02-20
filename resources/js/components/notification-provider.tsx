import { Toaster } from '@/components/ui/sonner';
import { useAppNotifications } from '@/hooks/use-app-notifications';

export function NotificationProvider() {
    useAppNotifications();

    return <Toaster />;
}

export default NotificationProvider;
