export const siteConfig = {
  name: 'Integration Scenarios',
  description:
    'Effortlessly integrate with the tools you already use. Here are a few scenarios to get you started.',
  githubLink: 'https://github.com/integration-app/examples',
  scenarios: [
    {
      name: 'Push companies to a CRM',
      description: 'Create or update companies in any CRM connected',
      slug: 'push-companies-to-a-crm',
      flowKey: 'push-company-to-a-crm',
      disabled: false,
    },
    {
      name: 'Continuous import of files',
      description: 'Continuously import files from any storage connected',
      slug: 'continuous-import-of-files',
      flowKey: 'get-drive-item-events',
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
