import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev' });

let db: PrismaClient;

declare global {
	// eslint-disable-next-line no-var
	var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
	db = new PrismaClient();
} else {
	if (!global.__db) {
		global.__db = new PrismaClient();
	}
	db = global.__db;
}

export { db };
