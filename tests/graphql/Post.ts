import { test } from 'uvu';
import { ok, snapshot } from 'uvu/assert';
import { createTestContext } from '../__helpers';

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
		data: draftData,
	}: { data: { createDraft: { id: number; title: string; body: string; published: boolean } } } =
		await draftResponse.json();
	snapshot(
		JSON.stringify(draftData),
		'{"createDraft":{"id":1,"title":"Nexus","body":"...","published":false}}',
	);

	const {
		createDraft: { id },
	} = draftData;

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
	}: { data: { createDraft: { id: number; title: string; body: string; published: boolean } } } =
		await publishResponse.json();
	snapshot(
		JSON.stringify(publishData),
		'{"publish":{"id":1,"title":"Nexus","body":"...","published":true}}',
	);
});

test.run();
