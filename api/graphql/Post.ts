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
				return ctx.db.post.findMany({ where: { published: false } });
			},
		});
		t.list.field('posts', {
			type: 'Post',
			resolve(_root, _args, ctx: Context) {
				return ctx.db.post.findMany({ where: { published: true } });
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
				const data = {
					title,
					body,
					published: false,
				};
				return ctx.db.post.create({ data });
			},
		});
		t.nonNull.field('deleteDraft', {
			type: 'Boolean',
			args: {
				draftId: nonNull(intArg()),
			},
			async resolve(_root, args: { draftId: number }, ctx: Context) {
				const { draftId: id } = args;
				const post = await ctx.db.post.findFirst({ where: { id, published: false } });
				return !!post;
			},
		});
		t.nonNull.field('publish', {
			type: 'Post',
			args: {
				draftId: nonNull(intArg()),
			},
			resolve(_root, args: { draftId: number }, ctx: Context) {
				const { draftId: id } = args;

				return ctx.db.post.update({
					where: { id },
					data: {
						published: true,
					},
				});
			},
		});
	},
});
