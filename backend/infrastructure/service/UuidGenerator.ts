// infrastructure/service/UuidGenerator.ts

import { v4 as uuidv4 } from 'uuid';
import { IUUIDGenerator } from '../../application/ports/IUUIDGenerator';

export class UuidGenerator implements IUUIDGenerator {
  generate(): string {
    return uuidv4();
  }
}
