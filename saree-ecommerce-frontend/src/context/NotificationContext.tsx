import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-20 right-5 z-50">
        {notifications.map(notification => (
          <NotificationToast key={notification.id} message={notification.message} type={notification.type} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

interface NotificationToastProps {
    message: string;
    type: NotificationType;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type }) => {
    const baseClasses = 'px-4 py-3 my-2 rounded-lg text-white shadow-lg flex items-center gap-2 animate-slide-in min-w-[250px]';
    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <span className="text-lg">{icons[type]}</span>
            <span className="flex-1">{message}</span>
        </div>
    )
}
