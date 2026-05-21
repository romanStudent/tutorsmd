import { FileValidationError } from '../../errors/FileValidationError';
import { ALLOWED_MIME_TYPES, SIZE_LIMITS } from './fileConstants';

export type FileNamespace =
  | "avatars"
  | "support/chats"
  | "lessons"
  | "lessons/materials";

export interface FileProps {
  readonly id:        string;
  readonly ownerId:   string;
  readonly namespace: FileNamespace;
  readonly name:      string;      // оригинальное имя файла
  readonly key:       string;      // R2 object key
  readonly url:       string;      // публичный/presigned URL
  readonly mimeType:  string;
  readonly size:      number;      // байты
  readonly createdAt: Date;
}

export class File {
  private readonly props: FileProps;

  private constructor(props: FileProps) {
    this.props = props;
  }

  static create(params: Omit<FileProps, 'createdAt'>): File {
    File.validateMimeType(params.mimeType);
    File.validateSize(params.size, params.namespace);
    File.validateName(params.name);
    File.validateKey(params.key, params.namespace);

    return new File({ ...params, createdAt: new Date() });
  }

  static reconstitute(props: FileProps): File {
    return new File(props);
  }

 
  get id():        string        { return this.props.id; }
  get ownerId():   string        { return this.props.ownerId; }
  get namespace(): FileNamespace { return this.props.namespace; }
  get name():      string        { return this.props.name; }
  get key():       string        { return this.props.key; }
  get url():       string        { return this.props.url; }
  get mimeType():  string        { return this.props.mimeType; }
  get size():      number        { return this.props.size; }
  get createdAt(): Date          { return this.props.createdAt; }

 
  get extension(): string {
    const parts = this.props.name.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }

  get isImage():    boolean { return this.props.mimeType.startsWith("image/"); }
  get isVideo():    boolean { return this.props.mimeType.startsWith("video/"); }
  get isDocument(): boolean {
    return (
      this.props.mimeType === "application/pdf" ||
      this.props.mimeType === "text/plain"      ||
      this.props.mimeType === "application/zip"
    );
  }

  get sizeInMb(): number {
    return Math.round((this.props.size / 1024 / 1024) * 100) / 100;
  }

  isOwnedBy(userId: string): boolean {
    return this.props.ownerId === userId;
  }

  toSnapshot(): FileProps {
    return { ...this.props };
  }



  private static validateMimeType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new FileValidationError(
        `File type "${mimeType}" is not allowed. Allowed: ${[...ALLOWED_MIME_TYPES].join(", ")}`
      );
    }
  }

  private static validateSize(size: number, namespace: FileNamespace): void {
    if (size <= 0) {
      throw new FileValidationError("File size must be greater than 0");
    }
    const limit = SIZE_LIMITS[namespace];
    if (size > limit) {
      throw new FileValidationError(
        `File exceeds size limit of ${Math.round(limit / 1024 / 1024)} MB for namespace "${namespace}"`
      );
    }
  }

  private static validateName(name: string): void {
    if (!name?.trim()) {
      throw new FileValidationError("File name cannot be empty");
    }
    if (name.length > 255) {
      throw new FileValidationError("File name cannot exceed 255 characters");
    }
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      throw new FileValidationError("File name contains illegal characters");
    }
  }

  private static validateKey(key: string, namespace: FileNamespace): void {
    if (!key.startsWith(namespace)) {
      throw new FileValidationError(
        `File key must start with namespace "${namespace}"`
      );
    }
    if (key.includes("..") || key.includes("//")) {
      throw new FileValidationError("File key contains illegal characters");
    }
  }
}