import { isCatalogId } from '../lakes/catalogSchemas';

// Only known internal destinations may be supplied through a deep link.
export function loginDestination(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    const match = /^\/lakes\/([^/]+)\/observations$/.exec(value);
    if (match && isCatalogId(match[1]))
      return {
        pathname: '/lakes/[id]/observations' as const,
        params: { id: match[1] },
      };
  }
  return value === '/profile' ? ('/profile' as const) : ('/' as const);
}
