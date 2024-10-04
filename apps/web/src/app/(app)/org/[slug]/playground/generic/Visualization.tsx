'use client'
import React, { FunctionComponent, useState } from 'react'

import {
  ClientAndSocketsVisualizationProps,
  makeClientAndSocketsVisualization,
} from './ClientAndSocketsVisualization'
import { makeServerVisualization } from './ServerVisualization'
import type {
  ApplicationSpecificComponents,
  ApplicationSpecificFunctions,
} from './types/applicationSpecific'
import { ClientName, Operation } from './types/operation'
import {
  ClientAndSocketsVisualizationState,
  SynchronizationStateStatus,
  VisualizationState,
} from './types/visualizationState'
import {
  Lens,
  makeJohnLens,
  makeYouLens,
  onClientOperation,
  onClientReceive,
  onServerReceive,
} from './visualizationStateReducer'

const makeInitialVisualizationState = <
  SnapshotT extends unknown,
  OpT extends unknown,
>(
  initialSnapshot: SnapshotT,
): VisualizationState<SnapshotT, OpT> => {
  const initialRevision = 0

  const initialClientAndSocketsVisualizationState: ClientAndSocketsVisualizationState<
    SnapshotT,
    OpT
  > = {
    toServer: [],
    fromServer: [],
    initialSynchronizationState: {
      status: SynchronizationStateStatus.SYNCHRONIZED,
      serverRevision: initialRevision,
    },
    clientLog: [],
    snapshot: initialSnapshot,
  }

  return {
    You: initialClientAndSocketsVisualizationState,
    john: initialClientAndSocketsVisualizationState,
    server: {
      operations: [],
      snapshot: initialSnapshot,
    },
  }
}

export const makeVisualization = <SnapshotT, OpT>(
  applicationSpecificFunctions: ApplicationSpecificFunctions<SnapshotT, OpT>,
  applicationSpecificComponents: ApplicationSpecificComponents<SnapshotT, OpT>,
): FunctionComponent<{ initialSnapshot: SnapshotT }> => {
  const ServerVisualization = makeServerVisualization(
    applicationSpecificComponents,
  )
  const ClientAndSocketsVisualization = makeClientAndSocketsVisualization(
    applicationSpecificComponents,
  )
  const YouLens = makeYouLens<SnapshotT, OpT>()

  const johnLens = makeJohnLens<SnapshotT, OpT>()

  return ({ initialSnapshot }) => {
    const [visualizationState, setVisualizationState] = useState<
      VisualizationState<SnapshotT, OpT>
    >(() => makeInitialVisualizationState(initialSnapshot))

    const makeClientProps = (
      clientLens: Lens<
        VisualizationState<SnapshotT, OpT>,
        ClientAndSocketsVisualizationState<SnapshotT, OpT>
      >,
      clientName: ClientName,
    ): Pick<
      ClientAndSocketsVisualizationProps<SnapshotT, OpT>,
      | 'state'
      | 'onClientOperation'
      | 'onServerReceiveClick'
      | 'onClientReceiveClick'
    > => ({
      state: clientLens.get(visualizationState),
      onClientOperation: (operation) => {
        setVisualizationState((visualizationState) =>
          onClientOperation(
            applicationSpecificFunctions,
            visualizationState,
            clientLens,
            clientName,
            operation,
          ),
        )
      },
      onServerReceiveClick: () => {
        setVisualizationState((visualizationState) =>
          onServerReceive(
            applicationSpecificFunctions,
            visualizationState,
            clientLens,
          ),
        )
      },
      onClientReceiveClick: () => {
        let transformedReceivedOperation: Operation<OpT> | undefined
        setVisualizationState((visualizationState) => {
          const { newState, transformedReceivedOperationToApply } =
            onClientReceive(
              applicationSpecificFunctions,
              visualizationState,
              clientLens,
            )
          transformedReceivedOperation = transformedReceivedOperationToApply
          return newState
        })
        return transformedReceivedOperation
      },
    })

    return (
      <div className="mx-auto flex w-full items-center justify-center">
        <div>
          <ServerVisualization state={visualizationState.server} />
          <div className="flex flex-row">
            <ClientAndSocketsVisualization
              clientName={ClientName.You}
              className=""
              {...makeClientProps(YouLens, ClientName.You)}
            />
            <ClientAndSocketsVisualization
              clientName={ClientName.John}
              className=""
              {...makeClientProps(johnLens, ClientName.John)}
            />
          </div>
        </div>
      </div>
    )
  }
}
