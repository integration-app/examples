import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataRecord } from '@integration-app/sdk'
import FileActions from './file-actions'

export default function FilesList({ files }: { files: DataRecord[] }) {
  return (
    <Table className='min-w-full leading-normal'>
      <TableHeader>
        <TableRow>
          <TableHead className='border-b-2 text-left text-xs font-medium uppercase tracking-wider'>
            Name
          </TableHead>
          <TableHead className='border-b-2 text-left text-xs font-medium uppercase tracking-wider'>
            Size
          </TableHead>
          <TableHead className='border-b-2 text-left text-xs font-medium uppercase tracking-wider'>
            Created Time
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <FileRow key={file.id} file={file} />
        ))}
      </TableBody>
    </Table>
  )
}

function FileRow({ file }: { file: DataRecord }) {
  return (
    <TableRow>
      <TableCell className='border-b'>{file.name}</TableCell>
      <TableCell className='border-b'>{file.unifiedFields?.size}</TableCell>
      <TableCell className='border-b'>
        {file.unifiedFields?.createdTime ?? 'unknown'}
      </TableCell>
      <TableCell className='border-b text-right'>
        <FileActions file={file} />
      </TableCell>
    </TableRow>
  )
}
