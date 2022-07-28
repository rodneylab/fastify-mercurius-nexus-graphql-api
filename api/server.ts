import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { schema } from './schema';

export const app: FastifyInstance = Fastify({
	logger: true,
});

app.get('/', async function (req, reply) {
	return reply.graphql('{}');
});

const start = async () => {
	try {
		await app.register(mercurius, {
			schema,
			subscription: true,
			graphiql: true,
		});
		await app.listen({ port: 4000 });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

void start();
