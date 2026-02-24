import React, { createContext, useContext } from "react";
import Toast from "react-native-toast-message";

type ToastContextType = {
  show: ((message: string) => void) | null;
};

const ToastContext = createContext<ToastContextType>({
  show: null,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const show = (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
