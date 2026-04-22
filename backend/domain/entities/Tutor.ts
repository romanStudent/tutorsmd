import { DomainError } from '../errors/DomainError';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface TutorProps {
  id: string;
  userId: string;
  avatarUrl: string | null;
  fulldescribeDe: string | null;
  fulldescribeRu: string | null;
  hourlyRate: number | null;
  nameDe: string | null;
  nameRu: string | null;
  surnameDe: string | null;
  surnameRu: string | null;
  highlightDe: string | null;
  highlightRu: string | null;
  ratingAvg: number;
  ratingCount: number;
  approvalStatus: ApprovalStatus;
  approvedAt: Date | null;
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTutorProps {
  id: string;
  userId: string;
  avatarUrl?: string | null;
  fulldescribeDe?: string | null;
  fulldescribeRu?: string | null;
  hourlyRate?: number | null;
  nameDe?: string | null;
  nameRu?: string | null;
  surnameDe?: string | null;
  surnameRu?: string | null;
  highlightDe?: string | null;
  highlightRu?: string | null;
}

interface RestoreTutorProps extends TutorProps {}

export class Tutor {
  private readonly props: TutorProps;

  private constructor(props: TutorProps) {
    this.props = props;
  }

  // --- Getters ---

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get avatarUrl(): string | null { return this.props.avatarUrl; }
  get fulldescribeGe(): string | null { return this.props.fulldescribeDe; }
  get fulldescribeRu(): string | null { return this.props.fulldescribeRu; }
  get hourlyRate(): number | null { return this.props.hourlyRate; }
  get nameDe(): string | null { return this.props.nameDe; }
  get nameRu(): string | null { return this.props.nameRu; }
  get surnameDe(): string | null { return this.props.surnameDe; }
  get surnameRu(): string | null { return this.props.surnameRu; }
  get highlightDe(): string | null { return this.props.highlightDe; }
  get highlightRu(): string | null { return this.props.highlightRu; }
  get ratingAvg(): number { return this.props.ratingAvg; }
  get ratingCount(): number { return this.props.ratingCount; }
  get approvalStatus(): ApprovalStatus { return this.props.approvalStatus; }
  get approvedAt(): Date | null { return this.props.approvedAt ? new Date(this.props.approvedAt) : null; }
  get approvedBy(): string | null { return this.props.approvedBy; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  get isApproved(): boolean { return this.props.approvalStatus === 'approved'; }
  get isPending(): boolean { return this.props.approvalStatus === 'pending'; }
  get isRejected(): boolean { return this.props.approvalStatus === 'rejected'; }

  // --- Business methods ---

  approve(adminUserId: string): Tutor {
    if (this.isApproved) {
      throw new DomainError('Tutor is already approved');
    }
    return new Tutor({
      ...this.props,
      approvalStatus: 'approved',
      approvedAt: new Date(),
      approvedBy: adminUserId,
      updatedAt: new Date(),
    });
  }

  reject(): Tutor {
    if (this.isRejected) {
      throw new DomainError('Tutor is already rejected');
    }
    return new Tutor({
      ...this.props,
      approvalStatus: 'rejected',
      approvedAt: null,
      approvedBy: null,
      updatedAt: new Date(),
    });
  }

  reapply(): Tutor {
    if (!this.isRejected) {
      throw new DomainError('Only rejected tutors can reapply');
    }
    return new Tutor({
      ...this.props,
      approvalStatus: 'pending',
      updatedAt: new Date(),
    });
  }

  setHourlyRate(rate: number): Tutor {
    if (rate <= 0) throw new DomainError('Hourly rate must be positive');
    if (rate > 10000) throw new DomainError('Hourly rate is unrealistic');
    return new Tutor({ ...this.props, hourlyRate: rate, updatedAt: new Date() });
  }

  changeAvatar(url: string): Tutor {
    if (!url || url.trim().length === 0) {
      throw new DomainError('Avatar URL cannot be empty');
    }
    return new Tutor({ ...this.props, avatarUrl: url, updatedAt: new Date() });
  }

  removeAvatar(): Tutor {
    return new Tutor({ ...this.props, avatarUrl: null, updatedAt: new Date() });
  }

  updateFulldescribe(de?: string | null, ru?: string | null): Tutor {
    if (de && de.length > 5000) throw new DomainError('Description DE too long');
    if (ru && ru.length > 5000) throw new DomainError('Description RU too long');
    return new Tutor({
      ...this.props,
      fulldescribeDe: de !== undefined ? de : this.props.fulldescribeDe,
      fulldescribeRu: ru !== undefined ? ru : this.props.fulldescribeRu,
      updatedAt: new Date(),
    });
  }

  updateLocalizedNames(props: {
    nameDe?: string;
    nameRu?: string;
    surnameDe?: string;
    surnameRu?: string;
  }): Tutor {
    return new Tutor({
      ...this.props,
      nameDe: props.nameDe ?? this.props.nameDe,
      nameRu: props.nameRu ?? this.props.nameRu,
      surnameDe: props.surnameDe ?? this.props.surnameDe,
      surnameRu: props.surnameRu ?? this.props.surnameRu,
      updatedAt: new Date(),
    });
  }

  updateHighlights(de?: string | null, ru?: string | null): Tutor {
    if (de && de.length > 500) throw new DomainError('Highlight DE too long');
    if (ru && ru.length > 500) throw new DomainError('Highlight RU too long');
    return new Tutor({
      ...this.props,
      highlightDe: de !== undefined ? de : this.props.highlightDe,
      highlightRu: ru !== undefined ? ru : this.props.highlightRu,
      updatedAt: new Date(),
    });
  }

  updateRating(newAvg: number, newCount: number): Tutor {
    if (newAvg < 0 || newAvg > 5) throw new DomainError('Rating avg must be between 0 and 5');
    if (newCount < 0) throw new DomainError('Rating count cannot be negative');
    return new Tutor({
      ...this.props,
      ratingAvg: newAvg,
      ratingCount: newCount,
      updatedAt: new Date(),
    });
  }

  // --- Factory methods ---

  static create(props: CreateTutorProps): Tutor {
    const now = new Date();
    return new Tutor({
      id: props.id,
      userId: props.userId,
      avatarUrl: props.avatarUrl ?? null,
      fulldescribeDe: props.fulldescribeDe ?? null,
      fulldescribeRu: props.fulldescribeRu ?? null,
      hourlyRate: props.hourlyRate ?? null,
      nameDe: props.nameDe ?? null,
      nameRu: props.nameRu ?? null,
      surnameDe: props.surnameDe ?? null,
      surnameRu: props.surnameRu ?? null,
      highlightDe: props.highlightDe ?? null,
      highlightRu: props.highlightRu ?? null,
      ratingAvg: 0,
      ratingCount: 0,
      approvalStatus: 'pending',
      approvedAt: null,
      approvedBy: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RestoreTutorProps): Tutor {
    return new Tutor({ ...props });
  }
}