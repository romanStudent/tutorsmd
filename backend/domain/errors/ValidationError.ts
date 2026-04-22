import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    // .setPrototypeOf - Без этой строки instanceof ломается при компиляции в ES5
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}