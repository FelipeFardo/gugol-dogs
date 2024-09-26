export function getAddressFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname + (parsedUrl.port ? `:${parsedUrl.port}` : '')
  } catch (error) {
    return ''
  }
}
