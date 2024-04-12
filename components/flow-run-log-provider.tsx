'use client'

import React, { useState } from 'react'
import { Flow, FlowRun } from '@integration-app/sdk'

export const FlowRunLogContext = React.createContext({})

export interface FlowRunLogContextType {
  flowRunItems: FlowRun[]
  setFlowRunItems: (_: FlowRun[]) => void
  addFlowRunItem: (_: FlowRun) => void
}

export default function FlowRunLogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flowRunItems, setFlowRunItems] = useState<FlowRun[]>([])

  const addFlowRunItem = (flowRun: FlowRun) => {
    setFlowRunItems((items) => [flowRun, ...items])
  }

  return (
    <FlowRunLogContext.Provider
      value={{ flowRunItems, setFlowRunItems, addFlowRunItem }}
    >
      {children}
    </FlowRunLogContext.Provider>
  )
}
