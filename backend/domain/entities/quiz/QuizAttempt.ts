import { DomainError } from '../../errors/DomainError';

interface QuizAttemptProps {
  id: string;
  quizId: string;
  lessonId: string | null;
  clientId: string;
  startedAt: Date;
  submittedAt: Date | null;
  totalPoints: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateQuizAttemptProps {
  id: string;
  quizId: string;
  lessonId?: string | null;
  clientId: string;
}

interface RestoreQuizAttemptProps extends QuizAttemptProps {}

export class QuizAttempt {
  private readonly props: QuizAttemptProps;

  private constructor(props: QuizAttemptProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get quizId(): string { return this.props.quizId; }
  get lessonId(): string | null { return this.props.lessonId; }
  get clientId(): string { return this.props.clientId; }
  get startedAt(): Date { return new Date(this.props.startedAt); }
  get submittedAt(): Date | null {
    return this.props.submittedAt ? new Date(this.props.submittedAt) : null;
  }
  get totalPoints(): number | null { return this.props.totalPoints; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  get isSubmitted(): boolean { return this.props.submittedAt !== null; }

  submit(): QuizAttempt {
    if (this.isSubmitted) {
      throw new DomainError('Quiz attempt already submitted');
    }
    return new QuizAttempt({
      ...this.props,
      submittedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  updateTotalPoints(points: number): QuizAttempt {
    if (!this.isSubmitted) {
      throw new DomainError('Cannot update points for non-submitted attempt');
    }
    if (points < 0) {
      throw new DomainError('Total points cannot be negative');
    }
    return new QuizAttempt({
      ...this.props,
      totalPoints: points,
      updatedAt: new Date(),
    });
  }

  static create(props: CreateQuizAttemptProps): QuizAttempt {
    const now = new Date();
    return new QuizAttempt({
      id: props.id,
      quizId: props.quizId,
      lessonId: props.lessonId ?? null,
      clientId: props.clientId,
      startedAt: now,
      submittedAt: null,
      totalPoints: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreQuizAttemptProps): QuizAttempt {
    return new QuizAttempt({ ...props });
  }
}