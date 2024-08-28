export interface User {
  id: string;
  username: string;
  lastName: string;
  firstName: string;
  email: string;
  // Add other fields as needed
}

export interface AuthContextType {
  user: User | null;
  authToken: string | null;
  kycStatus: string | null; // Added KYC status
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
