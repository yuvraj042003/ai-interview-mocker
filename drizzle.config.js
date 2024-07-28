
/** @type { import("drizzle-kit").Config } */
export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:W2igHL0rBKlE@ep-icy-pond-a5raj7fr.us-east-2.aws.neon.tech/neondb?sslmode=require',
  }
};