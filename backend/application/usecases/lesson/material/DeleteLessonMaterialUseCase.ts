import { ILessonMaterialRepository } from '../../../../domain/repositories/lesson/ILessonMaterialRepository';
import { IFileStorageFactory } from '../../../ports/file/IFileStorageFactory';
import { ClientId, TutorId, LessonMaterialId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { DomainError } from '../../../../domain/errors/DomainError';

export interface DeleteLessonMaterialDto {
  materialId:  string;
  deleterId:   string;
  deleterRole: 'client' | 'tutor';
}

export class DeleteLessonMaterialUseCase {
  constructor(
    private readonly materialRepo: ILessonMaterialRepository,
    private readonly fileStorage:  IFileStorageFactory,
  ) {}

  async execute(dto: DeleteLessonMaterialDto): Promise<void> {
    const materialId = new LessonMaterialId(dto.materialId);

    // 1. Найти материал
    const material = await this.materialRepo.findById(materialId.value);
    if (!material) throw new NotFoundError('Material not found');

    // 2. Проверить что именно этот участник загружал
    if (dto.deleterRole === 'client') {
      const clientId = new ClientId(dto.deleterId);
      if (material.uploadedByClient !== clientId.value) {
        throw new DomainError('You can only delete your own materials');
      }
    } else {
      const tutorId = new TutorId(dto.deleterId);
      if (material.uploadedByTutor !== tutorId.value) {
        throw new DomainError('You can only delete your own materials');
      }
    }

    // ТРАНЗАКЦИЯ здесь НЕ ПОМОЖЕТ -> Транзакция работает только для БД.
    /* РЕШЕНИЯ НА БУДУЩЕЕ //////////////////////////////////////////////////////////
        1. Saga pattern        - компенсирующие операции
        2. Outbox pattern      - PendingFileDeletion таблица (предложил выше)
        3. Idempotent retries  - повторные попытки с проверкой
    */
    // 3. Сначала удаляем из БД
    // Если R2 упадёт — запись уже удалена, файл станет сиротой в R2
    await this.materialRepo.delete(materialId.value);

    // 4. Потом удаляем из R2 — файл-сирота не критичен
    // Периодическая задача может чистить осиротевшие файлы
    await this.fileStorage.delete(material.fileUrl).catch(err =>
      console.error(`[DeleteLessonMaterial] R2 delete failed for key=${material.fileUrl}:`, err)
    );
  }
}