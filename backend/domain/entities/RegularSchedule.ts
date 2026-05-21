import { DomainError } from '../errors/DomainError';

export type CancelledByRole = 'client' | 'tutor';

interface RegularScheduleProps {
  id: string;
  tutorId: string;
  clientId: string;
  subjectId: string;
  dayOfWeek: number;       // 0-6 (0 = Sunday)
  timeOfDay: Date;         // Timetz — только время
  durationMinutes: number;
  isActive: boolean;
  cancelledAt: Date | null;
  cancelledBy: CancelledByRole | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRegularScheduleProps {
  id: string;
  tutorId: string;
  clientId: string;
  subjectId: string;
  dayOfWeek: number;
  timeOfDay: Date;
  durationMinutes?: number;
}

interface RestoreRegularScheduleProps extends RegularScheduleProps {}

export class RegularSchedule {
  private readonly props: RegularScheduleProps;

  private constructor(props: RegularScheduleProps) {
    this.props = props;
  }

  // --- Getters ---

  get id(): string { return this.props.id; }
  get tutorId(): string { return this.props.tutorId; }
  get clientId(): string { return this.props.clientId; }
  get subjectId(): string { return this.props.subjectId; }
  get dayOfWeek(): number { return this.props.dayOfWeek; }
  get timeOfDay(): Date { return new Date(this.props.timeOfDay); }
  get durationMinutes(): number { return this.props.durationMinutes; }
  get isActive(): boolean { return this.props.isActive; }
  get cancelledAt(): Date | null { return this.props.cancelledAt ? new Date(this.props.cancelledAt) : null; }
  get cancelledBy(): CancelledByRole | null { return this.props.cancelledBy; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  // --- Business methods ---

  cancelByClient(): RegularSchedule {
    if (!this.props.isActive) {
      throw new DomainError('Schedule is already cancelled');
    }
    return new RegularSchedule({
      ...this.props,
      isActive: false,
      cancelledAt: new Date(),
      cancelledBy: 'client',
      updatedAt: new Date(),
    });
  }

  cancelByTutor(): RegularSchedule {
    if (!this.props.isActive) {
      throw new DomainError('Schedule is already cancelled');
    }
    return new RegularSchedule({
      ...this.props,
      isActive: false,
      cancelledAt: new Date(),
      cancelledBy: 'tutor',
      updatedAt: new Date(),
    });
  }

  // --- Factory methods ---

  static create(props: CreateRegularScheduleProps): RegularSchedule {
    if (props.clientId === props.tutorId) {
      throw new DomainError('Client and tutor cannot be the same person');
    }
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      throw new DomainError('Day of week must be between 0 and 6');
    }
    if (props.durationMinutes !== undefined && props.durationMinutes <= 0) {
      throw new DomainError('Duration must be positive');
    }

    const now = new Date();
    return new RegularSchedule({
      id: props.id,
      tutorId: props.tutorId,
      clientId: props.clientId,
      subjectId: props.subjectId,
      dayOfWeek: props.dayOfWeek,
      timeOfDay: props.timeOfDay,
      durationMinutes: props.durationMinutes ?? 60,
      isActive: true,
      cancelledAt: null,
      cancelledBy: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreRegularScheduleProps): RegularSchedule {
    return new RegularSchedule({ ...props });
  }
}