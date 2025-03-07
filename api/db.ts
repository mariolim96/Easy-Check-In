// database.ts
import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";

// Create SQLDatabase instance with migrations configuration
const db = new SQLDatabase("test", {
  migrations: {
    path: "migrations",
    source: "drizzle",
  },
});

// Initialize Drizzle ORM with the connection string
const orm = drizzle(db.connectionString);

// Query all users
// await orm.select().from(users);
