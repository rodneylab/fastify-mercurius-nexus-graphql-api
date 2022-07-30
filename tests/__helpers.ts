import { FastifyInstance } from 'fastify';
import { test } from 'uvu';
import build from '../api/app';

export function createTestContext() {
	let serverInstance: FastifyInstance | null = null;

	test.before(async () => {
		serverInstance = await build({ logger: false });
	});

	test.before.each((meta) => {
		console.log(meta.__test__);
	});

	test.after(() => serverInstance?.close());

	return {
		async request(query: string, variables = {}) {
			return serverInstance?.inject({
				method: 'POST',
				url: 'graphql',
				headers: { 'content-type': 'application/json' },
				payload: { query, variables },
			});
		},
	};
}
