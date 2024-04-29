import { useContext } from 'react'
import Link from 'next/link'
import { DataRecord } from '@integration-app/sdk'

import { Button, buttonVariants } from '@/components/ui/button'
import { FilesContext, FilesContextType } from './files-provider'

export default function FileActions({ file }: { file: DataRecord }) {
  const { setOutput, setOutputOpen } = useContext(
    FilesContext,
  ) as FilesContextType

  return (
    <div className='flex justify-between items-center gap-2'>
      {file.rawFields ? (
        <Button
          variant='outline'
          className=''
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
      {file.unifiedFields?.downloadUri ? (
        <Link
          href={file.unifiedFields?.downloadUri}
          className={buttonVariants({ variant: 'link' })}
          target='_blank'
        >
          Download
        </Link>
      ) : (
        ''
      )}
    </div>
  )
}
