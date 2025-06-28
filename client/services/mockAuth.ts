// Frontend mock authentication when backend is not available
interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: MockUser;
}

const MOCK_USERS_KEY = "mock_users";
const MOCK_TOKEN_KEY = "mock_auth_token";

// Default users
const defaultUsers: MockUser[] = [
  {
    id: "demo_user_1",
    email: "demo@example.com",
    name: "Demo User",
    role: "analyst",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

// Get all mock users from localStorage
function getMockUsers(): MockUser[] {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load mock users from localStorage");
  }
  return [...defaultUsers];
}

// Save mock users to localStorage
function saveMockUsers(users: MockUser[]): void {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn("Failed to save mock users to localStorage");
  }
}

// Find user by email
function findMockUser(email: string): MockUser | undefined {
  const users = getMockUsers();
  return users.find((u) => u.email === email);
}

// Add new user
function addMockUser(user: MockUser): void {
  const users = getMockUsers();
  users.push(user);
  saveMockUsers(users);
}

// Generate mock JWT token
function generateMockToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

// Mock register function
export async function mockRegister(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if user already exists
  const existingUser = findMockUser(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const newUser: MockUser = {
    id: `mock_${Date.now()}`,
    email,
    name,
    role: "analyst",
    createdAt: new Date().toISOString(),
  };

  // Add to storage
  addMockUser(newUser);

  // Generate token
  const token = generateMockToken(newUser.id);

  // Store token
  localStorage.setItem(MOCK_TOKEN_KEY, token);

  return {
    token,
    user: newUser,
  };
}

// Mock login function
export async function mockLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find user
  const user = findMockUser(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // For demo user, check password. For others, accept any password
  if (email === "demo@example.com" && password !== "password123") {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateMockToken(user.id);

  // Store token
  localStorage.setItem(MOCK_TOKEN_KEY, token);

  return {
    token,
    user,
  };
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(MOCK_TOKEN_KEY);
  return !!token;
}

// Get current user
export function getCurrentMockUser(): MockUser | null {
  const token = localStorage.getItem(MOCK_TOKEN_KEY);
  if (!token) return null;

  // Extract user ID from token (mock implementation)
  const userIdMatch = token.match(/mock_token_(.+)_\d+/);
  if (!userIdMatch) return null;

  const userId = userIdMatch[1];
  const users = getMockUsers();
  return users.find((u) => u.id === userId) || null;
}

// Logout
export function mockLogout(): void {
  localStorage.removeItem(MOCK_TOKEN_KEY);
}
