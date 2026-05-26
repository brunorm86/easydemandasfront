// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className={`toast-container animate-fade-in ${notification.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    <div className="toast-icon">
                        {notification.type === 'success' ? '✅' : '⚠️'}
                    </div>
                    <div className="toast-message">
                        {notification.message}
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
