import { DataRecord } from '@integration-app/sdk'
import React, { useState } from 'react'

export const FilesContext = React.createContext({})

export interface FilesContextType {
  files: DataRecord[]
  setFiles: (_: DataRecord[]) => void
  path: DataRecord[]
  setPath: (_: Function | DataRecord[]) => void
  output: object
  setOutput: (_: object) => void
  outputOpen: boolean
  setOutputOpen: (_: boolean) => void
  downloading: string[]
  setDownloading: (_: Function | string[]) => void
}

export default function FilesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [files, setFiles] = useState<DataRecord[]>([])
  const [path, setPath] = useState<DataRecord[]>([])
  const [output, setOutput] = useState({})
  const [outputOpen, setOutputOpen] = useState(false)
  const [downloading, setDownloading] = useState<string[]>([])

  return (
    <FilesContext.Provider
      value={{
        files,
        setFiles,
        path,
        setPath,
        output,
        setOutput,
        outputOpen,
        setOutputOpen,
        downloading,
        setDownloading,
      }}
    >
      {children}
    </FilesContext.Provider>
  )
}
