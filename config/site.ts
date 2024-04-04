export const siteConfig = {
  name: 'Integration Scenarios',
  description:
    'Effortlessly integrate with the tools you already use. Here are a few scenarios to get you started.',
  scenarios: [
    {
      name: 'Push companies to a CRM',
      description: 'Create or update companies in any CRM connected',
      slug: 'push-companies-to-a-crm',
      flowKey: 'create-or-update-company-in-a-crm',
      disabled: false,
    },
    {
      name: 'Get people from a CRM',
      description: "It doesn't work",
      slug: 'get-people-from-a-crm',
      flowKey: 'none',
      disabled: false,
    },
  ],
  ogImage: 'https://tx.shadcn.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/taxonomy',
  },
}
