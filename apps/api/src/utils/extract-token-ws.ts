export function extractToken(cookie: string | undefined): string {
  if (!cookie) return ''
  const tokenPrefix = 'token='
  const tokenPart = cookie
    .split(';')
    .find((part) => part.trim().startsWith(tokenPrefix))

  if (tokenPart) {
    return tokenPart.trim().substring(tokenPrefix.length)
  }

  return ''
}
