import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const initializeNotifications = (authToken) => {
    fetchExerciseTransactions(authToken);
    const storedNotifications = JSON.parse(
      localStorage.getItem("gymNotifications") || "[]"
    );
    setNotifications(storedNotifications);
  };

  const fetchExerciseTransactions = async (authToken) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/exercise-transaction/show",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const exerciseTransactions = response.data.data;
      checkExpirations(exerciseTransactions);
    } catch (error) {
      console.error("Error fetching exercise transactions:", error);
    }
  };

  const checkExpirations = (exerciseTransactions) => {
    const currentDate = new Date();
    const threeDaysFromNow = new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    exerciseTransactions.forEach((exerciseTransaction) => {
      exerciseTransaction.transactions.forEach((transactionItem) => {
        if (transactionItem.isMainPlan) {
          const expireDate = new Date(transactionItem.expire_date);
          if (expireDate <= currentDate) {
            createNotification(2, exerciseTransaction, transactionItem);
          } else if (expireDate <= threeDaysFromNow) {
            createNotification(1, exerciseTransaction, transactionItem);
          }
        }
      });
    });
  };

  const createNotification = (type, exerciseTransaction, transactionItem) => {
    const message =
      type === 1
        ? `Subscription with transaction code ${
            exerciseTransaction.transaction_code
          } will expire on ${new Date(
            transactionItem.expire_date
          ).toLocaleDateString()}.`
        : `Subscription with transaction code ${
            exerciseTransaction.transaction_code
          } has expired on ${new Date(
            transactionItem.expire_date
          ).toLocaleDateString()}.`;

    setNotifications((prevNotifications) => {
      // Check if a notification with the same message already exists
      const notificationExists = prevNotifications.some(
        (notification) => notification.message === message
      );

      if (notificationExists) {
        return prevNotifications; // Don't add the notification if it already exists
      }

      const newNotification = {
        type,
        message,
        isRead: false,
        id: Date.now(),
      };

      const updatedNotifications = [...prevNotifications, newNotification];
      saveNotificationsToLocalStorage(updatedNotifications);
      return updatedNotifications;
    });
  };

  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem("gymNotifications", JSON.stringify(notifications));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      saveNotificationsToLocalStorage(updatedNotifications);
      return updatedNotifications;
    });
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      saveNotificationsToLocalStorage(updatedNotifications);
      return updatedNotifications;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        deleteNotification,
        initializeNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
