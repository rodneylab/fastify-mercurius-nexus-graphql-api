import type { Db } from './db';
import { db } from './db';

export interface Context {
	db: Db;
}

export const context = { db };
