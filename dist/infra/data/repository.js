import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = { subscribers: [] };
const db = new Low(adapter, defaultData);
await db.read();
export default db;
