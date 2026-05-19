import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string = 'Validation') {
    super(message);
  }
}