import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(message: string = 'NotFound') {
    super(message);
  }
}