export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';

    // Нужно для корректного instanceof в TypeScript
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}