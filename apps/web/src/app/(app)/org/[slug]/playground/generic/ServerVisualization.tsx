'use client'

// @ts-ignore
import clsx from 'clsx'
import { Server } from 'lucide-react'
import type { FunctionComponent } from 'react'
import React from 'react'

import { makeOperationVisualization } from './OperationVisualization'
import { useSharedStyles } from './sharedStyles'
import type { ApplicationSpecificComponents } from './types/applicationSpecific'
import type { ServerVisualizationState } from './types/visualizationState'

interface ServerVisualizationProps<SnapshotT, OpT> {
  state: ServerVisualizationState<SnapshotT, OpT>
}

export const makeServerVisualization = <
  SnapshotT extends unknown,
  OpT extends unknown,
>(
  applicationSpecificComponents: ApplicationSpecificComponents<SnapshotT, OpT>,
): FunctionComponent<ServerVisualizationProps<SnapshotT, OpT>> => {
  const OperationVisualization = makeOperationVisualization<OpT>(
    applicationSpecificComponents,
  )

  return ({ state }) => {
    const sharedClasses = useSharedStyles()

    return (
      <div className={clsx(sharedClasses.site, 'w-full')}>
        <h2 className="flex gap-3 font-bold">
          <Server />
          Server | API Node
        </h2>
        <table className="leading-8">
          <tbody>
            <tr>
              <th className="pr-2 text-left font-normal text-gray-600">
                Document:
              </th>
              <td className="pr-2 text-left font-normal text-gray-600">
                {applicationSpecificComponents.renderSnapshot(state.snapshot)}
              </td>
            </tr>
            <tr>
              <th className="pr-2 text-left font-normal text-gray-600">
                Operations:
              </th>
              <td>
                {state.operations.length === 0 ? <>N/D</> : <></>}
                {state.operations.map((operation) => (
                  <OperationVisualization
                    key={operation.meta.id}
                    operation={operation}
                    className="-align-[4px] mr-1 align-middle"
                  />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
