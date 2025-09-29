import type { User, LoginCredentials, SignupData, UserRole } from '../types';

const STORAGE_KEY = 'jalArogya_users';
const AUTH_KEY = 'jalArogya_auth';

// Generate simple ID for users
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Get all users from localStorage
export const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

// Save current authenticated user
export const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

// Register new user
export const registerUser = (signupData: SignupData): { success: boolean; message: string; user?: User } => {
  const { username, password, confirmPassword, role } = signupData;
  
  // Validation
  if (!username.trim()) {
    return { success: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (!password) {
    return { success: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }
  
  // Check if username already exists
  const existingUsers = getStoredUsers();
  const userExists = existingUsers.some(user => 
    user.username.toLowerCase() === username.toLowerCase()
  );
  
  if (userExists) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Create new user
  const newUser: User = {
    id: generateId(),
    username: username.trim(),
    password, // In real app, this would be hashed
    role,
    createdAt: new Date()
  };
  
  // Save user
  const updatedUsers = [...existingUsers, newUser];
  saveUsers(updatedUsers);
  
  return { success: true, message: 'Account created successfully', user: newUser };
};

// Login user
export const loginUser = (credentials: LoginCredentials): { success: boolean; message: string; user?: User } => {
  const { username, password } = credentials;
  
  if (!username.trim() || !password) {
    return { success: false, message: 'Username and password are required' };
  }
  
  const users = getStoredUsers();
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return { success: false, message: 'Invalid username or password' };
  }
  
  saveCurrentUser(user);
  return { success: true, message: 'Login successful', user };
};

// Logout user
export const logoutUser = (): void => {
  saveCurrentUser(null);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Get user role
export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Get demo users for testing
export const createDemoUsers = (): void => {
  const demoUsers: User[] = [
    {
      id: 'demo-citizen',
      username: 'citizen_demo',
      password: 'demo123',
      role: 'citizen',
      createdAt: new Date()
    },
    {
      id: 'demo-scientist',
      username: 'scientist_demo',
      password: 'demo123',
      role: 'scientist',
      createdAt: new Date()
    },
    {
      id: 'demo-policymaker',
      username: 'policy_demo',
      password: 'demo123',
      role: 'policymaker',
      createdAt: new Date()
    }
  ];
  
  const existingUsers = getStoredUsers();
  const hasDemo = existingUsers.some(user => user.id.startsWith('demo-'));
  
  if (!hasDemo) {
    saveUsers([...existingUsers, ...demoUsers]);
  }
};