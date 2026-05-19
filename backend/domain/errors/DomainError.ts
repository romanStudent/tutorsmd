export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name ?? "DomainError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}