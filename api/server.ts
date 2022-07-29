import type { FastifyInstance, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { context } from './context';
import { schema } from './schema';

export const app: FastifyInstance = Fastify({
	logger: true,
});

app.get('/', async function (req, reply) {
	return reply.graphql('{}');
});

const buildContext = async (req: FastifyRequest) => {
	return Promise.resolve({
		authorization: req.headers.authorization,
		...context,
	});
};

const start = async () => {
	try {
		await app.register(mercurius, {
			schema,
			context: buildContext,
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
