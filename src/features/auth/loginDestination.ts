// Only known internal destinations may be supplied through a deep link.
export function loginDestination(value: string | string[] | undefined) {
  return value === '/profile' ? ('/profile' as const) : ('/' as const);
}
