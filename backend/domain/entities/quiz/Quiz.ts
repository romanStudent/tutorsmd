import { DomainError } from '../../errors/DomainError';

export type QuestionType = 'free_text' | 'single_choice' | 'multiple_choice';

interface QuizProps {
  id: string;
  tutorId: string | null; // NULL = системный квиз (от админа)
  subjectId: string | null;
  title: string;
  description?: string | null; 
  createdAt: Date;
  updatedAt: Date;
}

interface CreateQuizProps {
  id: string;
  tutorId?: string | null;
  subjectId?: string | null;
  title: string;
  description?: string | null
}

interface RestoreQuizProps extends QuizProps {}

export class Quiz {
  private readonly props: QuizProps;

  private constructor(props: QuizProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get tutorId(): string | null { return this.props.tutorId; }
  get subjectId(): string | null { return this.props.subjectId; }
  get title(): string { return this.props.title; }
  get description(): string | null | undefined { return this.props.description; }
  get isSystemQuiz(): boolean { return this.props.tutorId === null; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  updateTitle(title: string): Quiz {
    if (!title || title.trim().length === 0) {
      throw new DomainError('Title cannot be empty');
    }
    if (title.trim().length > 255) {
      throw new DomainError('Title is too long');
    }
    return new Quiz({
      ...this.props,
      title: title.trim(),
      updatedAt: new Date(),
    });
  }

  static create(props: CreateQuizProps): Quiz {
    if (!props.title || props.title.trim().length === 0) {
      throw new DomainError('Quiz title cannot be empty');
    }
    if (props.title.trim().length > 255) {
      throw new DomainError('Quiz title is too long');
    }

    const now = new Date();
    return new Quiz({
      id: props.id,
      tutorId: props.tutorId ?? null,
      subjectId: props.subjectId ?? null,
      title: props.title.trim(),
      description: props.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreQuizProps): Quiz {
    return new Quiz({ ...props });
  }
}