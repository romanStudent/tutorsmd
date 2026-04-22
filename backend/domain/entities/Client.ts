import { DomainError } from '../errors/DomainError';

interface ClientProps {
  id: string;
  userId: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateClientProps {
  id: string;
  userId: string;
  avatarUrl?: string | null;
}

interface RestoreClientProps extends ClientProps {}

export class Client {
  private readonly props: ClientProps;

  private constructor(props: ClientProps) {
    this.props = props;
  }

  // --- Getters ---

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get avatarUrl(): string | null { return this.props.avatarUrl; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  // --- Business methods ---

  changeAvatar(url: string): Client {
    if (!url || url.trim().length === 0) {
      throw new DomainError('Avatar URL cannot be empty');
    }
    return new Client({
      ...this.props,
      avatarUrl: url.trim(),
      updatedAt: new Date(),
    });
  }

  removeAvatar(): Client {
    if (this.props.avatarUrl === null) {
      throw new DomainError('No avatar to remove');
    }
    return new Client({
      ...this.props,
      avatarUrl: null,
      updatedAt: new Date(),
    });
  }

  // --- Factory methods ---

  static create(props: CreateClientProps): Client {
    const now = new Date();
    return new Client({
      id: props.id,
      userId: props.userId,
      avatarUrl: props.avatarUrl ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreClientProps): Client {
    return new Client({ ...props });
  }
}