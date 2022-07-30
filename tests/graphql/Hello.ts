import { test } from 'uvu';
import { is, ok, snapshot } from 'uvu/assert';
import { createTestContext } from '../__helpers';

const ctx = createTestContext();

test('it sends expected response to hello query', async () => {
	const query = `
		query Query {
			hello
		}
	`;

	const response = await ctx.request(query);
	ok(response);

	const { data }: { data: { hello: string } } = await response.json();
	snapshot(JSON.stringify(data), '{"hello":"Hello everybody!"}');

	const { hello } = data;
	is(hello, 'Hello everybody!');
});

test.run();
