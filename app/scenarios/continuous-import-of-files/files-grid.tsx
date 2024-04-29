import React from 'react'
import FileCard from './file-card'
import { DataRecord } from '@integration-app/sdk'

export default function FilesGrid({ files }: { files: DataRecord[] }) {
  return (
    <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  )
}
