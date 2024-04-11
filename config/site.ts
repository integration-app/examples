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
      supportedApps: ['hubspot', 'salesforce'],
    },
    {
      name: 'Get people from a CRM',
      description: "It doesn't work",
      slug: 'get-people-from-a-crm',
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
