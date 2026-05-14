import { DomainError } from '../errors/DomainError';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

interface AvailableSlotProps {
  id: string;
  tutorId: string;
  dayOfWeek: number;   // 0-6
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  isActive: boolean;
  createdAt: Date;
}

interface CreateAvailableSlotProps {
  id: string;
  tutorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface RestoreAvailableSlotProps extends AvailableSlotProps {}

export class AvailableSlot {
  private readonly props: AvailableSlotProps;

  private constructor(props: AvailableSlotProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get tutorId(): string { return this.props.tutorId; }
  get dayOfWeek(): number { return this.props.dayOfWeek; }
  get startTime(): string { return this.props.startTime; }
  get endTime(): string { return this.props.endTime; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): Date { return new Date(this.props.createdAt); }

  deactivate(): AvailableSlot {
    if (!this.props.isActive) {
      throw new DomainError('Slot is already inactive');
    }
    return new AvailableSlot({ ...this.props, isActive: false });
  }

  activate(): AvailableSlot {
    if (this.props.isActive) {
      throw new DomainError('Slot is already active');
    }
    return new AvailableSlot({ ...this.props, isActive: true });
  }

  private static validateTime(time: string, field: string): void {
    if (!TIME_REGEX.test(time)) {
      throw new DomainError(`${field} must be in HH:MM format`);
    }
  }

  private static validateTimeRange(startTime: string, endTime: string): void {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (endMinutes <= startMinutes) {
      throw new DomainError('End time must be after start time');
    }

    // Минимальный слот — 30 минут
    if (endMinutes - startMinutes < 30) {
      throw new DomainError('Slot duration must be at least 30 minutes');
    }
  }

  static create(props: CreateAvailableSlotProps): AvailableSlot {
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      throw new DomainError('Day of week must be between 0 and 6');
    }

    AvailableSlot.validateTime(props.startTime, 'Start time');
    AvailableSlot.validateTime(props.endTime, 'End time');
    AvailableSlot.validateTimeRange(props.startTime, props.endTime);

    return new AvailableSlot({
      id: props.id,
      tutorId: props.tutorId,
      dayOfWeek: props.dayOfWeek,
      startTime: props.startTime,
      endTime: props.endTime,
      isActive: true,
      createdAt: new Date(),
    });
  }

  static restore(props: RestoreAvailableSlotProps): AvailableSlot {
    return new AvailableSlot({ ...props });
  }
}