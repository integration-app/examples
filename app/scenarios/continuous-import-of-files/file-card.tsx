import React from 'react'
import { DataRecord } from '@integration-app/sdk'

import { Card } from '@/components/ui/card'
import FileIcon from '@/components/file-icon'
import FileActions from './file-actions'

export default function FileCard({ file }: { file: DataRecord }) {
  return (
    <Card className='sm:w-full md:w-72 h-72 overflow-hidden relative'>
      {file?.fields?.previewUri ? (
        <div className='p-2 flex items-center justify-bottom'>
          <img
            className='w-full rounded-sm inline-flex'
            src={file?.fields?.previewUri}
            alt={file.name}
            width={250}
          />
        </div>
      ) : (
        <FileIcon file={file} />
      )}
      <div className='mt-16 p-4 bg-slate-50 dark:bg-slate-950 absolute inset-x-0 bottom-0'>
        <div className='mb-2 truncate'>{file.name}</div>
        <FileActions file={file} />
      </div>
    </Card>
  )
}
