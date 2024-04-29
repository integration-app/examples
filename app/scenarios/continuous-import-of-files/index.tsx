import FilesPage from './files-page'
import FilesProvider from './files-provider'

export function ContinuousImportOfFilesScenario({ params }: { params: any }) {
  return (
    <FilesProvider>
      <FilesPage params={params} />
    </FilesProvider>
  )
}
