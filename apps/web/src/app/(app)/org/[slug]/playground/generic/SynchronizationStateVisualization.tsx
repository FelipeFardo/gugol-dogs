'use client'
// @ts-ignore
import type { FunctionComponent } from 'react'
import React from 'react'

import type { OperationVisualizationComp } from './OperationVisualization'
import {
  SynchronizationState,
  SynchronizationStateStatus,
} from './types/visualizationState'

type SynchronizationStateVisualization<OpT> = FunctionComponent<{
  synchronizationState: SynchronizationState<OpT>
}>

export const makeSynchronizationStateVisualization =
  <OpT extends unknown>(
    OperationVisualization: OperationVisualizationComp<OpT>,
  ): SynchronizationStateVisualization<OpT> =>
  ({ synchronizationState }) => {
    const stateLabel = <span className="">State:</span>

    switch (synchronizationState.status) {
      case SynchronizationStateStatus.SYNCHRONIZED:
        return (
          <p className="rounded-xl border px-5 py-3 leading-6">
            {stateLabel} Synchronized at server revision{' '}
            {synchronizationState.serverRevision}
          </p>
        )
      case SynchronizationStateStatus.AWAITING_OPERATION:
        return (
          <p className="rounded-xl border px-5 py-3 leading-6">
            {stateLabel} Awaiting operation{' '}
            <OperationVisualization
              operation={synchronizationState.awaitedOperation}
              className="[-4px] m-0 mx-[2px] align-middle"
            />
          </p>
        )
      case SynchronizationStateStatus.AWAITING_OPERATION_WITH_BUFFER:
        return (
          <p className="rounded-xl border px-5 py-3 leading-6">
            {stateLabel} Awaiting operation{' '}
            <OperationVisualization
              operation={synchronizationState.awaitedOperation}
              className="[-4px] m-0 mx-[2px] align-middle"
            />{' '}
            with buffer{' '}
            <OperationVisualization
              operation={synchronizationState.buffer}
              className="[-4px] m-0 mx-[2px] align-middle"
            />
          </p>
        )
    }
  }
