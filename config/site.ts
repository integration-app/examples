export const siteConfig = {
  name: 'Integration Scenarios',
  description:
    'Effortlessly integrate with the tools you already use. Here are a few scenarios to get you started.',
  scenarios: [
    {
      name: 'Push companies to a CRM',
      description: 'Create or update companies in any CRM connected',
      slug: 'push-companies-to-a-crm',
      flowKey: 'push-company-to-a-crm',
      disabled: false,
    },
    {
      name: 'Push people to a CRM',
      description: 'Create or update contacts in any CRM connected',
      slug: 'push-people-to-a-crm',
      flowKey: 'none',
      disabled: false,
    },
  ],
  seed: {
    companies: [
      {
        id: 1,
        name: 'Microsoft Corporation',
        domain: 'microsoft.com',
        pushedInto: {},
      },
      { id: 2, name: 'Apple Inc.', domain: 'apple.com', pushedInto: {} },
      {
        id: 3,
        name: 'NVIDIA Corporation',
        domain: 'nvidia.com',
        pushedInto: {},
      },
    ],
  },
}
