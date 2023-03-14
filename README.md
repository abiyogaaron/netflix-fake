This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction)
The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Setup Local Environment

You need to setup a few API keys for this project to be setup correctly otherwise you won't see any videos.

- [Magic Server and Publishable Key](https://magic.link/docs)
- [Hasura Admin URL and JWT Secret](https://hasura.io/docs/latest/graphql/cloud/projects/create.html#create-project)
- [Youtube API Key](https://developers.google.com/youtube/v3/getting-started)

For that, you need to create a .env.local file in your project as [shown in docs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) that will look like this:

```
YOUTUBE_API_KEY=<REPLACE THIS>
NEXT_PUBLIC_MAGIC_API_KEY=<REPLACE THIS>
NEXT_PUBLIC_HASURA_ADMIN_KEY=<REPLACE THIS>
NEXT_PUBLIC_HASURA_ADMIN_URL=<REPLACE THIS>
MAGIC_SERVER_KEY=<REPLACE THIS>
HASURA_GRAPHQL_JWT_SECRET=<REPLACE THIS>
```

You can retrieve the above environment values by referring their docs linked above and once retrieved, paste above accordingly.
