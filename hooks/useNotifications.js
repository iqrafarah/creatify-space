import { useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (message) => {
    setNotifications(prev => [...prev, { key: Date.now(), message }]);
  };
  
  const removeNotification = (key) => {
    setNotifications(prev => prev.filter(notification => notification.key !== key));
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return { 
    notifications, 
    addNotification, 
    removeNotification, 
    clearNotifications 
  };
};