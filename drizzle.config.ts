import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({path: '.env'});
// console.log("hello" , process.env.DATABASE_URL);

export default {
    driver : 'pg',
    schema : './lib/db/schema.ts', // where the tables actually lives in 
    // out: "./drizzle",
    dbCredentials : {
        connectionString : process.env.DATABASE_URL as string,
    },
} satisfies Config;

// npx drizzle-kit push:pg -> this will looked up at schema and create and make sure that our database at newon is scyned up with our schema