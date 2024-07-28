import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleORM } from 'drizzle-orm/neon-http'; // Rename the import to avoid conflict
import * as schema from './schema';

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
const db = drizzleORM(sql, { schema });

export default db;
