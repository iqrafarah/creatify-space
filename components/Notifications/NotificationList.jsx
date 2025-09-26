import React from 'react';
import Notification from "@/components/Notifications/Toast";

export const NotificationList = ({ 
  notifications, 
  duration = 3000,
  onNotificationDismiss 
}) => {
  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.key}
          message={notification.message}
          duration={duration}
          onDismiss={() => onNotificationDismiss?.(notification.key)}
        />
      ))}
    </>
  );
};