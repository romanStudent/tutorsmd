
export type MaterialType = 'homework' | 'homework_done' | 'lesson_file' | 'other';

export interface LessonMaterialRecord {
  id:               string;
  lessonId:         string;
  uploadedByTutor:  string | null;
  uploadedByClient: string | null;
  materialType:     MaterialType;
  fileUrl:          string;
  fileName:         string;
  fileSize:         bigint | null;
  mimeType:         string | null;
  createdAt:        Date;
  updatedAt:        Date;
}

export interface CreateLessonMaterialData {
  id:               string;
  lessonId:         string;
  uploadedByTutor:  string | null;
  uploadedByClient: string | null;
  materialType:     MaterialType;
  fileUrl:          string;
  fileName:         string;
  fileSize:         bigint | null;
  mimeType:         string | null;
}

export interface ILessonMaterialRepository {
  findById(id: string): Promise<LessonMaterialRecord | null>;
  findByLessonId(lessonId: string): Promise<LessonMaterialRecord[]>;
  create(data: CreateLessonMaterialData): Promise<LessonMaterialRecord>;
  delete(id: string): Promise<void>;
}