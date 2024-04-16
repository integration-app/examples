import React, { useState } from 'react'
import { FlowRun } from '@integration-app/sdk'

export const FlowRunLogContext = React.createContext({})

export interface FlowRunLogContextType {
  flowRunItems: FlowRun[]
  setFlowRunItems: (_: FlowRun[]) => void
  upsertFlowRunItem: (_: FlowRun) => void
}

export default function FlowRunLogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flowRunItems, setFlowRunItems] = useState<FlowRun[]>([])

  const upsertFlowRunItem = (flowRun: FlowRun) => {
    setFlowRunItems((items) => {
      const existingIndex = items.findIndex((item) => item.id === flowRun.id)
      if (existingIndex !== -1) {
        const updatedItems = [...items]
        updatedItems[existingIndex] = flowRun
        return updatedItems
      } else {
        return [flowRun, ...items]
      }
    })
  }

  return (
    <FlowRunLogContext.Provider
      value={{
        flowRunItems,
        setFlowRunItems,
        upsertFlowRunItem,
      }}
    >
      {children}
    </FlowRunLogContext.Provider>
  )
}
