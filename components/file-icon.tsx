import { ReactElement, cloneElement } from 'react'
import { DataRecord } from '@integration-app/sdk'
import {
  File,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from 'lucide-react'

import { getFileType } from '@/lib/filetypes'
import { cn } from '@/lib/utils'

export const fileTypeIcons = {
  image: { fileIcon: <FileImage />, bgColor: 'bg-rose-600' },
  audio: { fileIcon: <FileAudio />, bgColor: 'bg-amber-600' },
  video: { fileIcon: <FileVideo />, bgColor: 'bg-cyan-500' },
  document: { fileIcon: <FileText />, bgColor: 'bg-blue-500' },
  spreadsheet: { fileIcon: <FileSpreadsheet />, bgColor: 'bg-green-600' },
  unknown: { fileIcon: <File />, bgColor: 'bg-amber-600' },
} as { [key: string]: any }

export default function FileIcon({ file }: { file: DataRecord }) {
  const fileType = getFileType(file)
  const { fileIcon, bgColor } = fileTypeIcons[fileType]

  return (
    <div className='p-2 flex h-64'>
      <div
        className={cn('w-full pt-10 flex justify-center rounded-sm', bgColor)}
      >
        {cloneElement(fileIcon, { color: 'white', size: '100' })}
      </div>
    </div>
  )
}
