# GraphQL API demo using Fastify, Mercurius and Nexus

Work in progress

GraphiQL GUI runs at http://localhost:4000/graphiql

## Test queries

### Queries

```graphql
{
	drafts {
		id
		title
		body
		published
	}
}
```

```graphql
query {
	posts {
		id
		title
		body
		published
	}
}
```

### Mutations

```graphql
mutation {
	createDraft(title: "Nexus", body: "...") {
		id
		title
		body
		published
	}
}
```

```graphql
mutation {
	deleteDraft(draftId: 1)
}
```

```graphql
mutation {
	publish(draftId: 1) {
		id
		title
		body
		published
	}
}
```
