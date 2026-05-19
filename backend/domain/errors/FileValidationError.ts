import { ValidationError } from './ValidationError';

export class FileValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}