export const planKeys = {
  all: ['plan'] as const,
  state: () => [...planKeys.all, 'state'] as const,
  analytics: () => [...planKeys.all, 'analytics'] as const,
}
