let _accessToken: string | null = null;

export const tokenManager = {
  get(): string | null { return _accessToken; },
  set(token: string): void { _accessToken = token; },
  clear(): void  { _accessToken = null; },
};