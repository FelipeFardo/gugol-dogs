'use client'

import { initialText } from './applicationSpecific/plainTextShared'
import {
  plainTextWithBasicOperationsComponents,
  plainTextWithBasicOperationsFunctions,
} from './applicationSpecific/plainTextWithBasicOperations'
import { OperationHoverProvider } from './generic/OperationHoverProvider'
import { makeVisualization } from './generic/Visualization'

const Visualization = makeVisualization(
  plainTextWithBasicOperationsFunctions,
  plainTextWithBasicOperationsComponents,
)

export function Playground() {
  return (
    <OperationHoverProvider>
      <Visualization initialSnapshot={initialText} />
    </OperationHoverProvider>
  )
}
