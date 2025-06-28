import { Transaction } from "./models/Transaction";
import { User } from "./models/User";
import { connectDatabase } from "./database";

const sampleTransactions = [
  {
    id: 1,
    date: "2024-01-15T08:34:12Z",
    amount: 1500.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Consulting services",
  },
  {
    id: 2,
    date: "2024-02-21T11:14:38Z",
    amount: 1200.5,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Office supplies",
  },
  {
    id: 3,
    date: "2024-03-03T18:22:04Z",
    amount: 300.75,
    category: "Revenue",
    status: "Pending",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Product sales",
  },
  {
    id: 4,
    date: "2024-04-10T05:03:11Z",
    amount: 5000.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Equipment purchase",
  },
  {
    id: 5,
    date: "2024-05-20T12:01:45Z",
    amount: 800.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Service fee",
  },
  {
    id: 6,
    date: "2024-06-12T03:13:09Z",
    amount: 2200.25,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Marketing campaign",
  },
  {
    id: 7,
    date: "2024-07-14T09:45:33Z",
    amount: 900.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Subscription revenue",
  },
  {
    id: 8,
    date: "2024-08-05T17:30:23Z",
    amount: 150.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Software license",
  },
  {
    id: 9,
    date: "2024-09-10T02:10:59Z",
    amount: 650.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Client payment",
  },
  {
    id: 10,
    date: "2024-10-30T14:55:12Z",
    amount: 1200.0,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Travel expenses",
  },
  {
    id: 11,
    date: "2024-11-25T10:02:25Z",
    amount: 1500.75,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Project milestone",
  },
  {
    id: 12,
    date: "2024-12-05T16:48:18Z",
    amount: 800.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Utility bills",
  },
  {
    id: 13,
    date: "2024-01-11T13:12:07Z",
    amount: 700.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Service fee",
  },
  {
    id: 14,
    date: "2024-02-17T04:35:01Z",
    amount: 200.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Office rent",
  },
  {
    id: 15,
    date: "2024-03-25T20:15:40Z",
    amount: 2500.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Large contract",
  },
  {
    id: 16,
    date: "2024-04-22T06:55:17Z",
    amount: 1700.0,
    category: "Expense",
    status: "Pending",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Equipment maintenance",
  },
  {
    id: 17,
    date: "2024-05-13T07:20:30Z",
    amount: 3500.5,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Premium service",
  },
  {
    id: 18,
    date: "2024-06-23T19:45:56Z",
    amount: 450.75,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Training materials",
  },
  {
    id: 19,
    date: "2024-07-01T01:20:11Z",
    amount: 900.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Monthly subscription",
  },
  {
    id: 20,
    date: "2024-08-07T11:05:48Z",
    amount: 2300.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Infrastructure costs",
  },
  {
    id: 21,
    date: "2024-09-15T09:31:02Z",
    amount: 850.25,
    category: "Revenue",
    status: "Pending",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Consultation fee",
  },
  {
    id: 22,
    date: "2024-10-04T12:42:49Z",
    amount: 1300.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Software subscriptions",
  },
  {
    id: 23,
    date: "2024-11-16T15:20:12Z",
    amount: 950.0,
    category: "Revenue",
    status: "Pending",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Service delivery",
  },
  {
    id: 24,
    date: "2024-12-23T17:05:03Z",
    amount: 2100.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Year-end bonuses",
  },
  {
    id: 25,
    date: "2024-01-14T09:50:15Z",
    amount: 700.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Quick service",
  },
  {
    id: 26,
    date: "2024-02-09T08:12:03Z",
    amount: 1000.5,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Inventory purchase",
  },
  {
    id: 27,
    date: "2024-03-16T20:29:45Z",
    amount: 1900.0,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Project completion",
  },
  {
    id: 28,
    date: "2024-04-13T13:22:58Z",
    amount: 1100.0,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
    user_profile: "https://thispersondoesnotexist.com/",
    description: "Professional services",
  },
];

export const seedDatabase = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    console.log("Clearing existing data...");
    await Transaction.deleteMany({});
    await User.deleteMany({});

    // Create demo user
    console.log("Creating demo user...");
    const demoUser = new User({
      email: "demo@example.com",
      password: "password123",
      name: "Demo User",
      role: "analyst",
    });
    await demoUser.save();

    // Insert sample transactions
    console.log("Inserting sample transactions...");
    const transactionsWithDates = sampleTransactions.map((t) => ({
      ...t,
      date: new Date(t.date),
    }));

    await Transaction.insertMany(transactionsWithDates);

    console.log(
      `Successfully seeded database with ${sampleTransactions.length} transactions and 1 user`,
    );
    console.log("Demo login credentials:");
    console.log("Email: demo@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run seeder if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
