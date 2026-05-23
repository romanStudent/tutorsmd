export interface IFileStorageFactory {
  buildKey(namespace: string, ownerId: string, fileName: string): string;
  getPresignedUploadUrl(key: string, mimeType: string, expiresInSeconds?: number): Promise<string>;
  getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<void>;
}