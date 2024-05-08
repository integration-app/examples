import { useContext, useState } from 'react'
import Link from 'next/link'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'
import { saveAs } from 'file-saver'
import { useParams } from 'next/navigation'

import { Button, buttonVariants } from '@/components/ui/button'
import { TokenContext } from '@/components/token-provider'
import { FilesContext, FilesContextType } from './files-provider'
import { Icons } from '@/components/icons'

export default function FileActions({ file }: { file: DataRecord }) {
  const { setOutput, setOutputOpen, downloading, setDownloading } = useContext(
    FilesContext,
  ) as FilesContextType
  const { connection }: { connection: string } = useParams()
  const token = useContext(TokenContext)

  async function downloadFile(file: DataRecord) {
    const integrationApp = new IntegrationAppClient({ token: token })
    setDownloading((state: string[]) => [...state, file.id])
    const opRun = (await integrationApp
      .connection(connection)
      .operation('download-file')
      // @ts-expect-error TS(2353): Object literal may only specify known properties, and 'fileId' does not exist in type 'OperationRunRequest'.
      .run({ fileId: file.id })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setDownloading((state: string[]) =>
          state.filter((id) => id !== file.id),
        )
      })) as { output: string }
    if (opRun) {
      const bytes = Buffer.from(opRun.output, 'base64')
      const blob = new Blob([bytes], { type: 'application/octet-stream' })
      saveAs(blob, file.name)
    }
  }

  const isDownloading = (file: DataRecord) => {
    return downloading.includes(file.id)
  }

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
          Raw fields
        </Button>
      ) : (
        ''
      )}
      {/* {file.unifiedFields?.downloadUri ? (
        <Link
          href={file.unifiedFields?.downloadUri}
          className={buttonVariants({ variant: 'link' })}
          target='_blank'
        >
          Download
        </Link>
      ) : ( */}
      {isDownloading(file) ? (
        <Button variant='outline' disabled>
          <Icons.spinner className='w-4 mr-3 animate-spin' />
          Download
        </Button>
      ) : (
        <Button
          variant='outline'
          onClick={() => {
            downloadFile(file)
          }}
        >
          <Icons.pull className='w-4 mr-3' />
          Download
        </Button>
      )}
    </div>
  )
}
