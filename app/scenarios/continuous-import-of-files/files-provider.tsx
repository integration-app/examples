import { DataRecord } from '@integration-app/sdk'
import React, { useState } from 'react'

export const FilesContext = React.createContext({})

export interface FilesContextType {
  files: DataRecord[]
  setFiles: (_: DataRecord[]) => void
  output: object
  setOutput: (_: object) => void
  outputOpen: boolean
  setOutputOpen: (_: boolean) => void
}

export default function FilesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [files, setFiles] = useState<DataRecord[]>([])
  const [output, setOutput] = useState({})
  const [outputOpen, setOutputOpen] = useState(false)

  return (
    <FilesContext.Provider
      value={{ files, setFiles, output, setOutput, outputOpen, setOutputOpen }}
    >
      {children}
    </FilesContext.Provider>
  )
}
