import { db } from './db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  const result = await db.execute(sql`SELECT 1 + 1 AS result`);
  console.log('Conexión OK:', result);
  process.exit(0);
}

testConnection().catch((err) => {
  console.error('Error de conexión:', err);
  process.exit(1);
});