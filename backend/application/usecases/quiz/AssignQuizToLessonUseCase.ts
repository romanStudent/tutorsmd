import { IQuizRepository } from '../../../domain/repositories/quiz/IQuizRepository';
import { ILessonRepository } from '../../../domain/repositories/ILessonRepository';
import { ILessonQuizRepository } from '../../../domain/repositories/quiz/ILessonQuizRepository';

import { TutorId, LessonId, QuizId } from '../../../domain/value-objects/EntityId';

import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { ConflictError } from '../../../domain/errors/ConflictError';


export interface AssignQuizToLessonDto {
  tutorId: string;
  lessonId: string;
  quizId: string;
}

export class AssignQuizToLessonUseCase {
  constructor(
    private readonly quizRepo: IQuizRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly lessonQuizRepo: ILessonQuizRepository,
  ) {}

  async execute(dto: AssignQuizToLessonDto): Promise<void> {
    const tutorId = new TutorId(dto.tutorId);
    const lessonId = new LessonId(dto.lessonId);
    const quizId = new QuizId(dto.quizId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Только тьютор урока может назначать квиз
    if (lesson.tutorId !== tutorId.value) {
      throw new DomainError('You are not the tutor of this lesson');
    }

    // 3. Урок должен быть активным
    if (lesson.isTerminal) {
      throw new DomainError('Cannot assign quiz to a terminal lesson');
    }

    // 4. Найти квиз
    const quiz = await this.quizRepo.findById(quizId.value);
    if (!quiz) throw new NotFoundError('Quiz not found');

    // 5. Тьютор может назначать только свои квизы
    if (quiz.tutorId !== tutorId.value) {
      throw new DomainError('You can only assign your own quizzes');
    }

    // 6. Проверяем что квиз ещё не назначен на этот урок
    const alreadyAssigned = await this.lessonQuizRepo.exists(lessonId.value, quizId.value);
    if (alreadyAssigned) {
      throw new ConflictError('Quiz already assigned to this lesson');
    }

    await this.lessonQuizRepo.create(lessonId.value, quizId.value);
  }
}