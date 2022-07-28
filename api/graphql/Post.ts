import { extendType, objectType } from 'nexus';

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
      resolve() {
        return [{ id: 1, title: 'Nexus', body: '...', published: false }];
      },
    });
  },
});
