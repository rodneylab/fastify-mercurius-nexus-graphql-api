import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import { Context } from '../context';

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.int('id');
		t.string('title');
		t.string('body');
		t.boolean('published');
	},
});

export const PostQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('drafts', {
			type: 'Post',
			resolve(_root, _args, ctx: Context) {
				return ctx.db.posts.filter(({ published }) => !published);
			},
		});
		t.list.field('posts', {
			type: 'Post',
			resolve(_root, _args, ctx: Context) {
				return ctx.db.posts.filter(({ published }) => published);
			},
		});
	},
});

export const PostMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createDraft', {
			type: 'Post',
			args: {
				title: nonNull(stringArg()),
				body: nonNull(stringArg()),
			},
			resolve(_root, args: { title: string; body: string }, ctx: Context) {
				const { body, title } = args;
				const draft = {
					id: ctx.db.posts.length + 1,
					title,
					body,
					published: false,
				};
				ctx.db.posts.push(draft);
				return draft;
			},
		});
		t.nonNull.field('publish', {
			type: 'Post',
			args: {
				draftId: nonNull(intArg()),
			},
			resolve(_root, args: { draftId: number }, ctx: Context) {
				const { draftId } = args;
				const draftToPublish = ctx.db.posts.find(({ id }) => id === draftId);

				if (!draftToPublish) {
					throw new Error(`Could not find draft with id ${draftId}`);
				}

				draftToPublish.published = true;

				return draftToPublish;
			},
		});
	},
});
