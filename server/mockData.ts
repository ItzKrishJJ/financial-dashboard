import { Transaction, User, DashboardStats } from "@shared/types";
import fs from "fs";
import path from "path";

// File to store mock users
const MOCK_USERS_FILE = path.join(process.cwd(), "mock-users.json");

// Default mock users
const defaultMockUsers: User[] = [
  {
    _id: "demo_user_1",
    email: "demo@example.com",
    name: "Demo User",
    role: "analyst",
    createdAt: new Date("2024-01-01"),
  },
  {
    _id: "admin_user_1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
];

// Load users from file or use defaults
let mockUsers: User[] = [];

function loadMockUsers(): void {
  try {
    if (fs.existsSync(MOCK_USERS_FILE)) {
      const data = fs.readFileSync(MOCK_USERS_FILE, "utf8");
      const users = JSON.parse(data);
      // Convert date strings back to Date objects
      mockUsers = users.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
      }));
    } else {
      mockUsers = [...defaultMockUsers];
      saveMockUsers();
    }
  } catch (error) {
    console.warn("Failed to load mock users, using defaults:", error);
    mockUsers = [...defaultMockUsers];
  }
}

function saveMockUsers(): void {
  try {
    fs.writeFileSync(MOCK_USERS_FILE, JSON.stringify(mockUsers, null, 2));
  } catch (error) {
    console.warn("Failed to save mock users:", error);
  }
}

// Initialize on module load
loadMockUsers();

// Mock user management functions
export const findMockUser = (email: string): User | undefined => {
  return mockUsers.find((u) => u.email === email);
};

export const addMockUser = (user: User): void => {
  mockUsers.push(user);
  saveMockUsers(); // Persist to file
};

export const getAllMockUsers = (): User[] => {
  return [...mockUsers];
};

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    _id: "1",
    id: 1,
    date: "2024-01-15T08:34:12Z",
    amount: 1500.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Consulting services",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    id: 2,
    date: "2024-02-21T11:14:38Z",
    amount: 1200.5,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Office supplies",
    createdAt: new Date("2024-02-21"),
    updatedAt: new Date("2024-02-21"),
  },
  {
    _id: "3",
    id: 3,
    date: "2024-03-03T18:22:04Z",
    amount: 300.75,
    category: "Revenue",
    status: "Pending",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Product sales",
    createdAt: new Date("2024-03-03"),
    updatedAt: new Date("2024-03-03"),
  },
  {
    _id: "4",
    id: 4,
    date: "2024-04-10T05:03:11Z",
    amount: 5000.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Equipment purchase",
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    _id: "5",
    id: 5,
    date: "2024-05-20T12:01:45Z",
    amount: 800.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Service fee",
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    _id: "6",
    id: 6,
    date: "2024-06-12T03:13:09Z",
    amount: 2200.25,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Marketing campaign",
    createdAt: new Date("2024-06-12"),
    updatedAt: new Date("2024-06-12"),
  },
  {
    _id: "7",
    id: 7,
    date: "2024-07-14T09:45:33Z",
    amount: 900.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Subscription revenue",
    createdAt: new Date("2024-07-14"),
    updatedAt: new Date("2024-07-14"),
  },
  {
    _id: "8",
    id: 8,
    date: "2024-08-05T17:30:23Z",
    amount: 150.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Software license",
    createdAt: new Date("2024-08-05"),
    updatedAt: new Date("2024-08-05"),
  },
  {
    _id: "9",
    id: 9,
    date: "2024-09-10T02:10:59Z",
    amount: 650.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Client payment",
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-09-10"),
  },
  {
    _id: "10",
    id: 10,
    date: "2024-10-30T14:55:12Z",
    amount: 1200.0,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Travel expenses",
    createdAt: new Date("2024-10-30"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    _id: "11",
    id: 11,
    date: "2024-11-25T10:02:25Z",
    amount: 1500.75,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Project milestone",
    createdAt: new Date("2024-11-25"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    _id: "12",
    id: 12,
    date: "2024-12-05T16:48:18Z",
    amount: 800.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Utility bills",
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-05"),
  },
  {
    _id: "13",
    id: 13,
    date: "2024-01-11T13:12:07Z",
    amount: 700.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Service fee",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    _id: "14",
    id: 14,
    date: "2024-02-17T04:35:01Z",
    amount: 200.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Office rent",
    createdAt: new Date("2024-02-17"),
    updatedAt: new Date("2024-02-17"),
  },
  {
    _id: "15",
    id: 15,
    date: "2024-03-25T20:15:40Z",
    amount: 2500.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Large contract",
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    _id: "16",
    id: 16,
    date: "2024-04-22T06:55:17Z",
    amount: 1700.0,
    category: "Expense",
    status: "Pending",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Equipment maintenance",
    createdAt: new Date("2024-04-22"),
    updatedAt: new Date("2024-04-22"),
  },
  {
    _id: "17",
    id: 17,
    date: "2024-05-13T07:20:30Z",
    amount: 3500.5,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Premium service",
    createdAt: new Date("2024-05-13"),
    updatedAt: new Date("2024-05-13"),
  },
  {
    _id: "18",
    id: 18,
    date: "2024-06-23T19:45:56Z",
    amount: 450.75,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Training materials",
    createdAt: new Date("2024-06-23"),
    updatedAt: new Date("2024-06-23"),
  },
  {
    _id: "19",
    id: 19,
    date: "2024-07-01T01:20:11Z",
    amount: 900.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Monthly subscription",
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    _id: "20",
    id: 20,
    date: "2024-08-07T11:05:48Z",
    amount: 2300.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Infrastructure costs",
    createdAt: new Date("2024-08-07"),
    updatedAt: new Date("2024-08-07"),
  },
];

// Mock password for demo user (hashed version of "password123")
export const mockPasswordHash =
  "$2a$12$rQJK9yZvOZ5Iu.9Qw4CgbOGEH6X7mYr3Kp8Vv7lXdQjFtN5hMzWqS";

export const getMockStats = (): DashboardStats => {
  const currentMonth = new Date();
  currentMonth.setDate(1);

  const revenue = mockTransactions
    .filter(
      (t) =>
        t.category === "Revenue" &&
        t.status === "Paid" &&
        new Date(t.date) >= currentMonth,
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = mockTransactions
    .filter(
      (t) =>
        t.category === "Expense" &&
        t.status === "Paid" &&
        new Date(t.date) >= currentMonth,
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalRevenue: revenue,
    totalExpenses: expenses,
    netIncome: revenue - expenses,
    transactionCount: mockTransactions.filter(
      (t) => new Date(t.date) >= currentMonth,
    ).length,
    revenueGrowth: 12.5, // Mock growth percentage
    expenseGrowth: 8.3, // Mock growth percentage
  };
};

export const getMockChartData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => {
    const monthTransactions = mockTransactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === index && t.status === "Paid";
    });

    const revenue = monthTransactions
      .filter((t) => t.category === "Revenue")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.category === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month,
      revenue,
      expenses,
    };
  });
};
