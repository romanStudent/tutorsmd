
interface ClientProps {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateClientProps {
  id: string;
  userId: string;
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
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }


  // --- Factory methods ---

  static create(props: CreateClientProps): Client {
    const now = new Date();
    return new Client({
      id: props.id,
      userId: props.userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreClientProps): Client {
    return new Client({ ...props });
  }
}