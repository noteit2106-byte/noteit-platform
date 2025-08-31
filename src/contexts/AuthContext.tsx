import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // Optional student ID for student users
  lastLogin?: string; // Timestamp of last login
  securityQuestion?: string; // Security question for password reset
  securityAnswer?: string; // Answer to security question (would be hashed in real app)
  isMainAdmin?: boolean; // Flag to mark the main admin account
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, studentId: string, securityQuestion: string, securityAnswer: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isMainAdmin: () => boolean;
  resetPassword: (email: string, securityAnswer: string) => Promise<string>;
  checkSecurityQuestion: (email: string) => Promise<string>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'noteitAA2@gmail.com', // Corrected email format
    password: '@itnotebit', // In a real app, this would be hashed
    role: 'admin' as UserRole,
    lastLogin: new Date('2023-12-15T08:30:45Z').toISOString(), // Example timestamp
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: 'fido', // In a real app, this would be hashed
    isMainAdmin: true // Mark as the main admin that cannot be deleted
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    password: 'student123', // In a real app, this would be hashed
    role: 'student' as UserRole,
    studentId: '2023CS001',
    lastLogin: new Date('2023-12-18T14:22:10Z').toISOString(), // Example timestamp
    securityQuestion: 'What is your mother\'s maiden name?',
    securityAnswer: 'smith' // In a real app, this would be hashed
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // State to store users (in a real app, this would be a database)
  const [users, setUsers] = useState<typeof MOCK_USERS>(MOCK_USERS);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Load any registered users from localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Ensure the main admin email is always correct and main admin flag is preserved
        const updatedMockUsers = MOCK_USERS.map(user => {
          if (user.isMainAdmin) {
            return { ...user, email: 'noteitAA2@gmail.com' };
          }
          return user;
        });
        setUsers([...updatedMockUsers, ...parsedUsers]);
      } catch (error) {
        console.error('Failed to parse stored users:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = users.find(
        u => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }
      
      // Add last login timestamp
      const currentTimestamp = new Date().toISOString();
      
      // Update the user list with the login timestamp
      const updatedUsers = users.map(u => {
        if (u.email === email) {
          return { ...u, lastLogin: currentTimestamp };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      
      // Save the updated users to localStorage (only registered users)
      const registeredUsers = updatedUsers.filter(
        u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
      );
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Create a user object without the password and security answer but with lastLogin
      const { password: _, securityAnswer: __, ...userWithoutSensitiveInfo } = matchedUser;
      const userWithLoginTimestamp = { 
        ...userWithoutSensitiveInfo, 
        lastLogin: currentTimestamp 
      };
      
      setUser(userWithLoginTimestamp);
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userWithLoginTimestamp));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    studentId: string, 
    securityQuestion: string, 
    securityAnswer: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with this email already exists
      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: 'student' as UserRole,
        studentId,
        securityQuestion,
        securityAnswer
      };
      
      // Add user to the list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Save registered users to localStorage (excluding the built-in mock users)
      const registeredUsers = updatedUsers.filter(
        u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
      );
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Don't automatically log in after registration
      return;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isMainAdmin = () => {
    return user?.isMainAdmin === true;
  };

  // Get security question for a specific email
  const checkSecurityQuestion = async (email: string): Promise<string> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const existingUser = users.find(u => u.email === email);
      
      if (!existingUser || !existingUser.securityQuestion) {
        throw new Error('No account found with this email address or no security question set');
      }
      
      return existingUser.securityQuestion;
    } catch (error) {
      console.error('Error retrieving security question:', error);
      throw error;
    }
  };

  // Reset password with security question
  const resetPassword = async (email: string, securityAnswer: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with this email exists
      const existingUser = users.find(u => u.email === email);
      
      if (!existingUser) {
        throw new Error('No account found with this email address');
      }
      
      // Check security answer
      if (!existingUser.securityAnswer || existingUser.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()) {
        throw new Error('Security answer is incorrect');
      }
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(2, 10);
      
      // Update user's password
      const updatedUsers = users.map(u => {
        if (u.email === email) {
          return { ...u, password: tempPassword };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      
      // Save the updated users to localStorage
      const registeredUsers = updatedUsers.filter(
        u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
      );
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      return tempPassword;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete user function with protection for main admin
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      // Find the user
      const userToDelete = users.find(u => u.id === userId);
      
      if (!userToDelete) {
        throw new Error('User not found');
      }
      
      // Prevent deletion of main admin
      if (userToDelete.isMainAdmin) {
        throw new Error('Cannot delete the main administrator account');
      }
      
      // Delete the user
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      // Update localStorage
      const registeredUsers = updatedUsers.filter(
        u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
      );
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      return Promise.resolve();
    } catch (error) {
      console.error('User deletion failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
    isMainAdmin,
    resetPassword,
    checkSecurityQuestion,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}