'use client'

import clsx from 'clsx'
import { ArrowDown, ArrowUp, Laptop, Tablet } from 'lucide-react'
import React, {
  CSSProperties,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { makeClientLogVisualization } from './ClientLogVisualization'
import { useIsInitialRender } from './hooks/useIsInitialRender'
import {
  makeOperationVisualization,
  OperationVisualizationComp,
} from './OperationVisualization'
import { getClientColor, useSharedStyles } from './sharedStyles'
import type {
  ApplicationSpecificComponents,
  EditorHandle,
} from './types/applicationSpecific'
import { ClientName, Operation, OperationAndRevision } from './types/operation'
import type {
  ClientAndSocketsVisualizationState,
  Queue,
} from './types/visualizationState'

const useSocketOperationStyles = () => {
  return {
    operationInSocket:
      'absolute transform -translate-y-1/2 transition-all duration-500', // position: 'absolute' -> absolute, transform: 'translate(0, -50%)' -> transform -translate-y-1/2, transitionProperty: 'top' -> transition-all, transitionDuration: '0.5s' -> duration-500
  }
}

interface OperationInSocketProps<OpT> {
  operation: OperationAndRevision<OpT>
  initialPositionTop?: string
  positionTop?: string
  disableHover?: boolean
  onTransitionEnd?: () => void
}

const makeOperationInSocket =
  <OpT extends unknown>(
    OperationVisualization: OperationVisualizationComp<OpT>,
  ): FunctionComponent<OperationInSocketProps<OpT>> =>
  (props) => {
    const classes = useSocketOperationStyles()

    const isInitialRender = useIsInitialRender()

    const positionStyle: CSSProperties =
      isInitialRender && props.initialPositionTop !== undefined
        ? { top: props.initialPositionTop }
        : props.positionTop !== undefined
          ? { top: props.positionTop }
          : {}

    const hoverStyle: CSSProperties = props.disableHover
      ? { pointerEvents: 'none' }
      : {}

    return (
      <OperationVisualization
        operation={props.operation}
        className={classes.operationInSocket}
        style={{ ...positionStyle, ...hoverStyle }}
        onTransitionEnd={props.onTransitionEnd}
      />
    )
  }

enum SocketDirection {
  UP,
  DOWN,
}

interface SocketProps<OpT> {
  direction: SocketDirection
  tooltip: string
  queue: Queue<OperationAndRevision<OpT>>
  onReceiveClick: () => void
}

const makeSocketVisualization = <OpT extends unknown>(
  OperationVisualization: OperationVisualizationComp<OpT>,
): FunctionComponent<SocketProps<OpT>> => {
  const OperationInSocket = makeOperationInSocket(OperationVisualization)

  return ({ queue, onReceiveClick, direction, tooltip }) => {
    const queueEmpty = queue.length === 0

    const [delayedQueue, setDelayedQueue] = useState<typeof queue>([])

    useEffect(() => {
      setDelayedQueue((delayedQueue) => [
        ...delayedQueue.filter((operation) => !queue.includes(operation)),
        ...queue,
      ])
    }, [queue])

    const positionInverter = direction === SocketDirection.DOWN ? '100% -' : ''

    const receiveButton = (
      <Button
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full  p-1 text-yellow-400 transition-colors duration-200 hover:bg-gray-700"
        onClick={onReceiveClick}
        disabled={queueEmpty}
        style={{ top: `calc(${positionInverter} 0%)` }}
      >
        {direction === SocketDirection.UP ? <ArrowUp /> : <ArrowDown />}
      </Button>
    )

    const leavingOps = delayedQueue.filter(
      (operation) => !queue.includes(operation),
    )

    return (
      <div className="relative mx-10 h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{receiveButton}</TooltipTrigger>
            <TooltipContent>{queueEmpty ? '' : tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <Tooltip title={queueEmpty ? '' : tooltip}>{receiveButton}</Tooltip> */}
        <div className="absolute left-[-1px] z-[-1] h-full border-l-2 border-dashed border-gray-200" />
        <div className="relative left-[-10px] h-full w-[20px] overflow-hidden overflow-x-visible">
          {[
            ...leavingOps.map((operation) => (
              <OperationInSocket
                key={operation.meta.id}
                operation={operation}
                positionTop={`calc(${positionInverter} 0px)`}
                disableHover={
                  true /* prevent accidentally triggering tooltip when operation moves */
                }
                onTransitionEnd={() =>
                  setDelayedQueue((delayedQueue) =>
                    delayedQueue.filter((o) => o !== operation),
                  )
                }
              />
            )),
            ...queue.map((operation, i) => (
              <OperationInSocket
                key={operation.meta.id}
                operation={operation}
                positionTop={`calc(${positionInverter} 100% / ${queue.length + 1} * ${i + 1})`}
                initialPositionTop={`calc(${positionInverter} (100% + 20px))`}
              />
            )),
          ]}
        </div>
      </div>
    )
  }
}

export interface ClientAndSocketsVisualizationProps<SnapshotT, OpT> {
  clientName: ClientName
  className: string
  state: ClientAndSocketsVisualizationState<SnapshotT, OpT>
  onClientOperation: (operation: OpT) => void
  onServerReceiveClick: () => void
  onClientReceiveClick: () => Operation<OpT> | undefined
}

export const getClientIcon = (clientName: ClientName): JSX.Element => {
  switch (clientName) {
    case ClientName.You:
      return <Laptop />
    case ClientName.John:
      return <Tablet />
  }
}

export const makeClientAndSocketsVisualization = <
  SnapshotT extends unknown,
  OpT extends unknown,
>(
  applicationSpecific: ApplicationSpecificComponents<SnapshotT, OpT>,
): FunctionComponent<ClientAndSocketsVisualizationProps<SnapshotT, OpT>> => {
  const OperationVisualization = makeOperationVisualization(applicationSpecific)
  const SocketVisualization = makeSocketVisualization(OperationVisualization)
  const ClientLogVisualization = makeClientLogVisualization(applicationSpecific)
  const { EditorComponent } = applicationSpecific

  return ({
    onClientOperation,
    onClientReceiveClick,
    onServerReceiveClick,
    state,
    clientName,
    className,
  }) => {
    const sharedClasses = useSharedStyles()

    const editorHandleRef = useRef<EditorHandle<OpT>>(null)

    const onClientReceive = useCallback(() => {
      const operationToApply = onClientReceiveClick()
      if (operationToApply !== undefined) {
        editorHandleRef.current?.applyOperation(operationToApply.base)
      }
    }, [onClientReceiveClick])

    return (
      <div className={className}>
        <div className="relative flex h-[150px] flex-row justify-center">
          <SocketVisualization
            direction={SocketDirection.UP}
            tooltip="Receive next operation from client"
            queue={state.toServer}
            onReceiveClick={onServerReceiveClick}
          />
          <SocketVisualization
            direction={SocketDirection.DOWN}
            tooltip="Receive next operation from server"
            queue={state.fromServer}
            onReceiveClick={onClientReceive}
          />
        </div>
        <div
          className={clsx(
            sharedClasses.site,
            'relative z-10 mb-3 flex w-[460px] flex-col',
          )}
        >
          <h2
            className="flex gap-2 text-xl"
            style={{ color: getClientColor(clientName) }}
          >
            {getClientIcon(clientName)}
            {clientName}
          </h2>
          <EditorComponent
            snapshot={state.snapshot}
            onUserChange={onClientOperation}
            ref={editorHandleRef}
          />
        </div>
        <ClientLogVisualization
          clientLog={state.clientLog}
          initialSynchronizationState={state.initialSynchronizationState}
        />
      </div>
    )
  }
}
