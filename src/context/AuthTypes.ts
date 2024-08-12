export interface User {
    id: string;
    username: string;
    email: string;
    // Add other fields as needed
  }
  
  export interface AuthContextType {
    user: User | null;
    authToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
  }
  