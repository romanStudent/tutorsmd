import { uuidv7 } from 'uuidv7';
import { IUUIDGenerator } from '../../application/ports/IUUIDGenerator';

export class UUIDGenerator implements IUUIDGenerator {
  generate(): string {
    return uuidv7();
  }
}
