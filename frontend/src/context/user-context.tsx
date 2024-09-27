import { createContext, useContext, useState, ReactNode } from "react";

// Define the context shape
interface UserContextType {
  userId: string | null;
  setUserId: (userId: string) => void;
}

// create context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);;

// create provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// create hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
