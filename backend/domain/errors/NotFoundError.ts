import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    // .setPrototypeOf - Без этой строки instanceof ломается при компиляции в ES5
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}