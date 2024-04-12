export const siteConfig = {
  name: 'Integration Scenarios',
  description:
    'Effortlessly integrate with the tools you already use. Here are a few scenarios to get you started.',
  scenarios: [
    {
      name: 'Push companies to a CRM',
      description: 'Create or update companies in any CRM connected',
      slug: 'push-companies-to-a-crm',
      universalFlowId: '66143ff8ef6d666e7a6d830a',
      flowKey: 'push-company-to-a-crm',
      disabled: false,
    },
    {
      name: 'Push people to a CRM',
      description: 'Create or update contacts in any CRM connected',
      slug: 'push-people-to-a-crm',
      universalFlowId: 'none',
      flowKey: 'none',
      disabled: false,
    },
  ],
  seed: {
    companies: [
      {
        name: 'Microsoft Corporation',
        domain: 'microsoft.com',
        pushedInto: {},
      },
      { name: 'Apple Inc.', domain: 'apple.com', pushedInto: {} },
      { name: 'NVIDIA Corporation', domain: 'nvidia.com', pushedInto: {} },
    ],
  },
}
