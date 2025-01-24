import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CustomAlert } from "../components/common/alert";

type AlertType = "info" | "warning" | "error" | "success" | "loading" | "other";

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ type, message });
  };

  useEffect(() => {
    if (alertState) {
      const timer = setTimeout(() => {
        setAlertState(null);
      }, 3600); // 3.6 seconds (3 seconds visible + 0.3 seconds fade in + 0.3 seconds fade out)

      return () => clearTimeout(timer);
    }
  }, [alertState]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState && (
        <CustomAlert type={alertState.type} message={alertState.message} />
      )}
    </AlertContext.Provider>
  );
};
