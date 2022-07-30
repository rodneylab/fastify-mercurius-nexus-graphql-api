import { FastifyInstance } from 'fastify';
import build from './app';

let app: FastifyInstance | null = null;

const start = async () => {
	try {
		app = await build();
		await app.listen({ port: 4000 });
	} catch (err) {
		app?.log.error(err);
		process.exit(1);
	}
};

void start();
