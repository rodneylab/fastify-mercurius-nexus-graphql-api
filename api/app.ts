import type { FastifyInstance, FastifyRequest, FastifyServerOptions } from 'fastify';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { context } from './context';
import { schema } from './schema';

const buildContext = async (req: FastifyRequest) => {
	return Promise.resolve({
		authorization: req.headers.authorization,
		...context,
	});
};

let app: FastifyInstance | null = null;

async function build(options: FastifyServerOptions = { logger: true }) {
	try {
		app = Fastify(options);
		app.get('/', async function (_req, reply) {
			return reply.graphql('{}');
		});

		await app.register(mercurius, {
			schema,
			context: buildContext,
			subscription: true,
			graphiql: true,
		});

		return app;
	} catch (err) {
		if (app) app.log.error(err);
		process.exit(1);
	}
}

export default build;
