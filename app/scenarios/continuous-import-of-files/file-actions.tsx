import { useCallback, useContext } from 'react'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'
import { saveAs } from 'file-saver'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TokenContext } from '@/components/token-provider'
import { FilesContext, FilesContextType } from './files-provider'
import { Icons } from '@/components/icons'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'

const googleExportTypes = {
  'application/vnd.google-apps.document': [
    {
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { odt: 'application/vnd.oasis.opendocument.text' },
    { rtf: 'application/rtf' },
    { txt: 'text/plain' },
    { html: 'text/html' },
    { pdf: 'application/pdf' },
    { epub: 'application/epub+zip' },
    { zip: 'application/zip' },
  ],
  'application/vnd.google-apps.spreadsheet': [
    {
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    { ods: 'application/vnd.oasis.opendocument.spreadsheet' },
    { csv: 'text/csv' },
    { tsv: 'text/tab-separated-values' },
    { pdf: 'application/pdf' },
    { zip: 'application/zip' },
  ],
  'application/vnd.google-apps.presentation': [
    {
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
    { odp: 'application/vnd.oasis.opendocument.presentation' },
    { pdf: 'application/pdf' },
    { txt: 'text/plain' },
  ],
  'application/vnd.google-apps.drawing': [
    { svg: 'image/svg+xml' },
    { png: 'image/png' },
    { pdf: 'application/pdf' },
    { jpg: 'image/jpeg' },
  ],
} as Record<string, { [key: string]: string }[]>

export default function FileActions({ file }: { file: DataRecord }) {
  const {
    path,
    setPath,
    setOutput,
    setOutputOpen,
    downloading,
    setDownloading,
  } = useContext(FilesContext) as FilesContextType
  const { connection }: { connection: string } = useParams()
  const token = useContext(TokenContext)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value !== '') {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams],
  )

  function browseFolder(file: DataRecord) {
    setPath((state: DataRecord[]) => [...state, file])
    router.push(pathname + '?' + createQueryString('folderId', file.id))
  }

  function browseParentFolder() {
    setPath((state: DataRecord[]) => state.slice(0, state.length - 1))
    router.push(
      pathname +
        '?' +
        createQueryString('folderId', path[path.length - 2]?.id ?? ''),
    )
  }

  async function downloadFile(
    file: DataRecord,
    extension?: string,
    exportAs?: string,
  ) {
    const integrationApp = new IntegrationAppClient({ token: token })
    setDownloading((state: string[]) => [...state, file.id])

    const payload = { fileId: file.id } as {
      fileId: string
      exportAs?: string
    }

    let addExtension = false
    if (Object.keys(googleExportTypes).includes(file.fields?.mimeType)) {
      addExtension = true
      const opts = googleExportTypes[file.fields?.mimeType][0]
      extension = extension ?? Object.keys(opts)[0]
      payload['exportAs'] = exportAs || Object.values(opts)[0]
    }

    const actionRun = await integrationApp
      .actionInstance({
        parentKey: 'download-file',
        integrationKey: connection,
        autoCreate: true,
      })
      .run(payload)
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setDownloading((state: string[]) =>
          state.filter((id) => id !== file.id),
        )
      })
    if (actionRun) {
      const bytes = Buffer.from(actionRun.output, 'base64')
      const blob = new Blob([bytes], { type: 'application/octet-stream' })
      saveAs(blob, addExtension ? `${file.name}.${extension}` : file.name)
    }
  }

  const isDownloading = (file: DataRecord) => {
    return downloading.includes(file.id)
  }

  const browseButton = (
    <Button
      variant='outline'
      onClick={() => {
        browseFolder(file)
      }}
    >
      Browse
    </Button>
  )
  const browseParentButton = (
    <Button
      variant='outline'
      onClick={() => {
        browseParentFolder()
      }}
    >
      Go to parent folder
    </Button>
  )

  const downloadButton = (
    <Button
      variant='outline'
      onClick={() => {
        downloadFile(file)
      }}
      disabled={isDownloading(file)}
    >
      {isDownloading(file) ? (
        <Icons.spinner className='w-4 mr-3 animate-spin' />
      ) : (
        <Icons.pull className='w-4 mr-3' />
      )}
      Download
    </Button>
  )

  const downloadSplitButton = (
    <div className='flex items-center'>
      <Button
        variant='outline'
        onClick={() => {
          downloadFile(file)
        }}
        className={'rounded-r-none'}
        disabled={isDownloading(file)}
      >
        {isDownloading(file) ? (
          <Icons.spinner className='w-4 mr-3 animate-spin' />
        ) : (
          <Icons.pull className='w-4 mr-3' />
        )}
        Download
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className={'rounded-l-none border-l-0 px-2'}
            disabled={isDownloading(file)}
          >
            <Icons.more />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          alignOffset={0}
          className='min-w-4rem w-4rem'
          forceMount
        >
          {file.fields &&
            googleExportTypes[file.fields.mimeType]
              ?.slice(1)
              ?.map((opts, index) => {
                const extenstion = Object.keys(opts)[0]
                const mimeType = opts[extenstion]
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      downloadFile(file, extenstion, mimeType)
                    }}
                  >
                    Export as .{extenstion}
                  </DropdownMenuItem>
                )
              })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <div className='flex justify-between items-center gap-2'>
      {file.rawFields ? (
        <Button
          variant='outline'
          onClick={() => {
            setOutput(file.rawFields as object)
            setOutputOpen(true)
          }}
        >
          <Icons.json className='w-4' />
        </Button>
      ) : (
        ''
      )}
      {file.fields?.itemType === 'parent'
        ? browseParentButton
        : file.fields?.itemType === 'folder'
          ? browseButton
          : Object.keys(googleExportTypes).includes(file.fields?.mimeType) &&
              googleExportTypes[file.fields?.mimeType].length > 1
            ? downloadSplitButton
            : downloadButton}
    </div>
  )
}
