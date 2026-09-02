import { toast } from 'sonner';

export type Notification = {
  id?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

export const useNotifications = () => {
  const addNotification = (notification: Notification) => {
    const { type, title, message } = notification;

    const options = {
      description: message,
    };

    switch (type) {
      case 'success':
        toast.success(title, options);
        break;
      case 'error':
        toast.error(title, options);
        break;
      case 'warning':
        toast.warning(title, options);
        break;
      case 'info':
      default:
        toast.info(title, options);
        break;
    }
  };

  return { addNotification };
};
