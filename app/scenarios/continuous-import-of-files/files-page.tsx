import { useContext, useEffect, useState } from 'react'
import { DataRecord } from '@integration-app/sdk'
import ReactJson from '@microlink/react-json-view'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'

import { FlowPageProps } from '@/app/[scenario]/[connection]/page'
import { TokenContext } from '@/components/token-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import FilesGrid from './files-grid'
import FilesList from './files-list'
import { FilesContext, FilesContextType } from './files-provider'
import ViewModeToggle from './view-mode-toggle'
import { Icons } from '@/components/icons'

export function useFileUpdates(
  integration: string,
  importing: boolean,
  setImporting: Function,
) {
  const token = useContext(TokenContext) as string
  const { files, setFiles } = useContext(FilesContext) as FilesContextType

  useEffect(() => {
    let interval: NodeJS.Timeout

    interval = setInterval(async () => {
      const response = await fetch(`/api/files/${integration}`, {
        headers: {
          'x-integration-app-token': token,
        },
      })
      const data = await response.json()
      if (response.ok === false || !data.records) {
        setImporting(false)
        console.error(data)

        return
      }
      if (data.records.length > 0) {
        setFiles(data.records)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [setImporting, integration, token, setFiles])

  return [files, setFiles]
}

export default function FilesPage({ params }: FlowPageProps) {
  const token = useContext(TokenContext) as string
  const themeData = useTheme()

  const [importing, setImporting] = useState(false)
  const { output, outputOpen, setOutputOpen } = useContext(
    FilesContext,
  ) as FilesContextType

  const [viewMode, setViewMode] = useLocalStorage<'list' | 'grid'>(
    'viewmode',
    'grid',
  )
  const [files, setFiles] = useFileUpdates(
    params.connection,
    importing,
    setImporting,
  ) as [DataRecord[], Function]
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId')
  const visibleFiles = folderId
    ? [
        { id: '', fields: { itemType: 'parent' } },
        ...files.filter((file) => file.fields?.folderId == folderId),
      ]
    : files

  async function startImport() {
    setImporting(true)
    const response = await fetch(`/api/files/${params.connection}/init`, {
      method: 'POST',
      headers: {
        'x-integration-app-token': token,
      },
    })
    const data = await response.json()
    if (response.ok === false || !data.records) {
      console.error(data)
    } else if (data.records.length > 0) {
      setFiles(data.records)
    }
    setImporting(false)
  }

  return (
    <>
      <div className='flex justify-between items-center w-full mt-2 mb-4'>
        <div className='flex items-center'>
          <h2 className='mr-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-slate-200 sm:text-4xl gap-6'>
            Files
          </h2>
          <Button onClick={startImport} disabled={importing}>
            {importing ? (
              <Icons.spinner className='w-4 mr-3 animate-spin' />
            ) : null}
            Import
          </Button>
        </div>
        <ViewModeToggle currentMode={viewMode} setMode={setViewMode} />
      </div>
      <Dialog modal={false} open={outputOpen} onOpenChange={setOutputOpen}>
        <DialogContent className='md:w-max md:max-w-fit sm:max-w-screen overflow-hidden'>
          <DialogHeader>
            <DialogTitle>Raw fields</DialogTitle>
            <DialogDescription>
              These are raw fields from the storage service
            </DialogDescription>
          </DialogHeader>
          <div className='overflow-auto max-h-80'>
            <ReactJson
              src={output}
              name={false}
              collapsed={1}
              quotesOnKeys={false}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
              iconStyle='square'
              style={{ padding: 8, backgroundColor: 'transparent' }}
              theme={
                themeData.resolvedTheme === 'light' ? 'rjv-default' : 'harmonic'
              }
            />
          </div>
        </DialogContent>
      </Dialog>
      {visibleFiles?.length ? (
        viewMode === 'list' ? (
          <FilesList files={visibleFiles} />
        ) : (
          <FilesGrid files={visibleFiles} />
        )
      ) : (
        <section className='py-12'>Files will appear here.</section>
      )}
    </>
  )
}
