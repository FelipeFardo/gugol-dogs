import { ClientName } from './types/operation'

export const useSharedStyles = () => {
  return {
    // site: 'bg-gray-200 p-5 mx-4',
    site: 'bg-muted/50 p-5 mx-4 rounded-lg shadow-md',
    header: 'mb-4 text-xl font-semibold text-gray-800',
    svg: 'ml-1 mr-3 align-bottom w-5 h-5 text-gray-600',
  }
}

export const getClientColor = (clientName: ClientName): string => {
  switch (clientName) {
    case ClientName.You:
      return '#0074D9' // Adicione esta cor personalizada nas configurações do Tailwind, se necessário
    case ClientName.John:
      return '#e2451e' // Adicione esta cor personalizada nas configurações do Tailwind, se necessário
    default:
      return ''
  }
}
