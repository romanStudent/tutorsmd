import { Prisma, PrismaClient } from '../../../../generated/prisma';
import {
  ILessonMaterialRepository,
  LessonMaterialRecord,
  CreateLessonMaterialData,
  MaterialType,
} from '../../../../domain/repositories/lesson/ILessonMaterialRepository';

type MaterialRow = Prisma.LessonMaterialGetPayload<{}>;

export class PrismaLessonMaterialRepository implements ILessonMaterialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<LessonMaterialRecord | null> {
    const record = await this.prisma.lessonMaterial.findUnique({ where: { id } });
    if (!record) return null;
    return this.toRecord(record);
  }

  async findByLessonId(lessonId: string): Promise<LessonMaterialRecord[]> {
    const records = await this.prisma.lessonMaterial.findMany({
      where:   { lessonId },
      orderBy: { createdAt: 'asc' },
    });
    return records.map(r => this.toRecord(r));
  }

  async create(data: CreateLessonMaterialData): Promise<LessonMaterialRecord> {
    const record = await this.prisma.lessonMaterial.create({
      data: {
        id:               data.id,
        lessonId:         data.lessonId,
        uploadedByTutor:  data.uploadedByTutor,
        uploadedByClient: data.uploadedByClient,
        materialType:     data.materialType,
        fileUrl:          data.fileUrl,
        fileName:         data.fileName,
        fileSize:         data.fileSize,
        mimeType:         data.mimeType,
      },
    });
    return this.toRecord(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lessonMaterial.delete({ where: { id } });
  }

  private toRecord(r: MaterialRow): LessonMaterialRecord {
    return {
      id:               r.id,
      lessonId:         r.lessonId,
      uploadedByTutor:  r.uploadedByTutor,
      uploadedByClient: r.uploadedByClient,
      materialType:     r.materialType as MaterialType,
      fileUrl:          r.fileUrl,
      fileName:         r.fileName,
      fileSize:         r.fileSize,
      mimeType:         r.mimeType,
      createdAt:        r.createdAt,
      updatedAt:        r.updatedAt
    };
  }
}