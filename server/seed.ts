import { User } from "./models/User";
import { Transaction } from "./models/Transaction";

export const seedDemoData = async (): Promise<void> => {
  try {
    // Check if demo user already exists
    const existingDemoUser = await User.findOne({ email: "demo@example.com" });

    if (!existingDemoUser) {
      // Create demo user
      const demoUser = new User({
        email: "demo@example.com",
        password: "password123", // Will be hashed automatically
        name: "Demo User",
        role: "analyst",
      });

      await demoUser.save();
      console.log("✅ Demo user created successfully");
    } else {
      console.log("✅ Demo user already exists");
    }

    // Check if demo transactions exist
    const existingTransactions = await Transaction.countDocuments();

    if (existingTransactions === 0) {
      // Create sample transactions
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
      ];

      await Transaction.insertMany(sampleTransactions);
      console.log("✅ Sample transactions created successfully");
    } else {
      console.log("✅ Transactions already exist");
    }
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
  }
};
