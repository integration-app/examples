import CompaniesPage from './companies-page'
import CompaniesProvider from './companies-provider'

export function PushCompaniesToACrmScenario({ params }: { params: any }) {
  return (
    <CompaniesProvider>
      <CompaniesPage params={params} />
    </CompaniesProvider>
  )
}
