# Integration Scenarios

This is a [Next.js](https://nextjs.org/) project using the [App router](https://nextjs.org/docs/app), containing examples of using [Integration.app](https://integration.app).

## Getting Started

- Copy `.env-sample` to `.env` and fill in the required values
- `npm i`
- `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the project files.

## Enabling scenarios

To make scenario in the app work end-to-end, you need to add a corresponding scenario to your workspace from the list of scenario templates and apply it to relevant apps.

You can find the name of the matching scenario name as displayed in this app's UI.

## Add new scenario to the app

First, you need to create and set up a Flow in your [Integration.app console](https://console.integration.app/w/0/integrations/flows). Then:

1. Add a new scenario to `scenarios` in [config/site.ts](config/site.ts)
1. Implement front-end logic of the scenario using existing and/or creating new components
1. Describe a handler for the scenario in [app/[scenario]/[connection]/page.tsx](app/[scenario]/[connection]/page.tsx)
1. If you'd like to provide users with some test data, add it to `seed` in `config/site.ts`, and use that data in your components like in [components/companies-provider.tsx](components/companies-provider.tsx)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
