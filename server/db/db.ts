// database.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";

export const db = new SQLDatabase("UserDB", { migrations: "./migrations" });

// export const profilePictures = new Bucket("profile-pictures", {versioned: false, public: false});
