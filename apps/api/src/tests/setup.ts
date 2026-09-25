import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../../../../.env'), override: true });

const dbUrl = process.env.TEST_DATABASE_URL ?? '';
// if (!dbUrl.includes('test') && !dbUrl.includes('trello_test')) {
//   throw new Error(
//     `Refusing to run tests: DATABASE_URL does not look like a test database (${dbUrl}). Check .env.`
//   );
// }