// Estrutura de uma operação
export interface Operation {
  index: number
  chars: string
  type: 'insert' | 'delete'
}

// Função para aplicar uma operação de transformação no projeto
export function applyOperation(document: string, operation: Operation): string {
  const { index, chars, type } = operation
  if (type === 'insert') {
    return document.slice(0, index) + chars + document.slice(index)
  } else if (type === 'delete') {
    return document.slice(0, index) + document.slice(index + chars.length)
  }
  return document
}

// Função para criar uma operação
export function createOperation(
  index: number,
  chars: string,
  type: 'insert' | 'delete',
): Operation {
  return { index, chars, type }
}
