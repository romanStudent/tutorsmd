import { File, FileNamespace } from "../entities/File";

export interface IFileRepository {
  save(file: File): Promise<void>;
  findById(id: string): Promise<File | null>;
  findByOwnerId(ownerId: string, namespace?: FileNamespace): Promise<File[]>;
  delete(id: string): Promise<void>;
}