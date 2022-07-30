import { test } from 'uvu';
import { ok, snapshot, type } from 'uvu/assert';
import { createTestContext } from '../../testHelpers';

const ctx = createTestContext();

test('it ensures that a draft can be created and published', async () => {
	const draftQuery = `
		mutation {
			createDraft(title: "Nexus", body: "...") {
				id
				title
				body
				published
			}
		}
	`;

	const draftResponse = await ctx.request(draftQuery);
	ok(draftResponse);

	const {
		data: {
			createDraft: { id, title, body, published },
		},
	}: { data: { createDraft: { id: number; title: string; body: string; published: boolean } } } =
		await draftResponse.json();
	type(id, 'number');
	snapshot(
		JSON.stringify({ title, body, published }),
		'{"title":"Nexus","body":"...","published":false}',
	);

	const publishQuery = `
		mutation publishDraft($draftId: Int!) {
			publish(draftId: $draftId) {
				id
				title
				body
				published
			}
		}
	`;
	const variables = { draftId: id };

	const publishResponse = await ctx.request(publishQuery, variables);
	ok(publishResponse);

	const {
		data: publishData,
	}: { data: { publish: { id: number; title: string; body: string; published: boolean } } } =
		await publishResponse.json();

	snapshot(
		JSON.stringify(publishData),
		`{"publish":{"id":${id},"title":"Nexus","body":"...","published":true}}`,
	);

	const persistedData = await ctx.db.post.findMany();
	snapshot(
		JSON.stringify(persistedData),
		`[{"id":${id},"title":"Nexus","body":"...","published":true}]`,
	);
});

test.run();
