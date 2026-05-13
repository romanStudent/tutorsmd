import { Quiz } from '../../../domain/entities/quiz/Quiz';
import { IQuizRepository } from '../../../domain/repositories/quiz/IQuizRepository';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { TutorId, SubjectId, QuizId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface CreateQuizDto {
  tutorId: string;
  subjectId: string;
  title: string;
  description?: string | null;
}

export interface CreateQuizResult {
  quizId: string;
}

export class CreateQuizUseCase {
  constructor(
    private readonly quizRepo: IQuizRepository,
    private readonly tutorRepo: ITutorRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: CreateQuizDto): Promise<CreateQuizResult> {
    const tutorId = new TutorId(dto.tutorId);
    const subjectId = new SubjectId(dto.subjectId);
    const quizId = new QuizId(this.idGenerator.generate());

    // Проверяем что тьютор существует и одобрен
    const tutor = await this.tutorRepo.findById(tutorId.value);
    if (!tutor) throw new NotFoundError('Tutor not found');
    if (!tutor.isApproved) throw new DomainError('Tutor is not approved');

    const quiz = Quiz.create({
      id: quizId.value,
      tutorId: tutorId.value,
      subjectId: subjectId.value,
      title: dto.title,
      description: dto.description ?? null,
    });

    await this.quizRepo.create(quiz);

    return { quizId: quiz.id };
  }
}