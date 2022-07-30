import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { join } from 'node:path';
import { test } from 'uvu';
import build from './api/app';

import { config } from 'dotenv';
config({ path: '.env.test' });

interface TestContext {
	db: PrismaClient;
	request: (
		query: string,
		variables?: Record<string, string | number>,
	) => Promise<LightMyRequestResponse | undefined>;
}

function prismaTestContext() {
	const prismaBinary = join(__dirname, 'node_modules', '.bin', 'prisma');
	let prismaClient: null | PrismaClient = null;

	return {
		async before() {
			execSync(`${prismaBinary} db push`);

			prismaClient = new PrismaClient();
			await prismaClient.post.deleteMany({});

			return prismaClient;
		},
		async after() {
			await prismaClient?.$disconnect();
		},
	};
}

export function createTestContext(): TestContext {
	const ctx = {} as TestContext;
	let serverInstance: FastifyInstance | null = null;
	const prismaCtx = prismaTestContext();
	test.before(async () => {
		serverInstance = await build({ logger: false });
	});

	test.before.each(async (meta) => {
		console.log(meta.__test__);
		const db = await prismaCtx.before();

		async function request(query: string, variables = {} as Record<string, string>) {
			return serverInstance?.inject({
				method: 'POST',
				url: 'graphql',
				headers: { 'content-type': 'application/json' },
				payload: { query, variables },
			});
		}

		Object.assign(ctx, { db, request });
	});

	test.after(() => serverInstance?.close());

	return ctx;
}
