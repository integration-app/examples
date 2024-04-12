# Integration Scenarios

This is a [Next.js](https://nextjs.org/) project using the [App router](https://nextjs.org/docs/app), containing examples of using [Integration.app](https://integration.app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the project files.

## Add new Scenario

First, you need to create and set up a Flow in your [Integration.app console](https://console.integration.app/w/0/integrations/flows). Then:

1. Add a new scenario to `scenarios` in [config/site.ts](config/site.ts)
1. Implement front-end logic of the scenario using existing and/or creating new components
1. Describe a handler for the scenario in [app/[scenario]/[connection]/page.tsx](app/[scenario]/[connection]/page.tsx)
1. If you'd like to provide users with some test data, add it to `seed` in `config/site.ts`, and use that data in your components like in [components/companies-provider.tsx](components/companies-provider.tsx)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
