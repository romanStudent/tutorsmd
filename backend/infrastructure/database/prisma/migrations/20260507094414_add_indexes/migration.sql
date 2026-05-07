-- This is an empty migration.
-- ============================================================
-- TutorsMD — Indexes Migration
-- Применять ПОСЛЕ основной миграции (migrate reset / migrate dev)
-- Команда: npx prisma migrate dev --name add_indexes --create-only
-- Вставить содержимое этого файла в сгенерированный migration.sql
-- ============================================================

-- ============================================================
-- users
-- ============================================================

-- Логин по email — самый частый запрос
CREATE INDEX idx_users_email ON users(email);

-- Covering index для логина — не лезет в таблицу вообще
CREATE INDEX idx_users_email_covering
    ON users(email)
    INCLUDE (id, password_hash, is_email_verified);

-- ============================================================
-- refresh_tokens
-- ============================================================

-- Только активные токены (не отозванные)
CREATE INDEX idx_refresh_tokens_user_active
    ON refresh_tokens(user_id)
    WHERE revoked_at IS NULL;

-- Поиск по hash при каждом запросе с токеном
CREATE INDEX idx_refresh_tokens_hash
    ON refresh_tokens(token_hash)
    WHERE revoked_at IS NULL;

-- ============================================================
-- tutors
-- ============================================================

-- Поиск тьюторов по имени
CREATE INDEX idx_tutors_name
    ON tutors(user_id);

-- Только одобренные тьюторы (для публичного листинга)
CREATE INDEX idx_tutors_approved
    ON tutors(approval_status)
    WHERE approval_status = 'approved';

-- Сортировка по рейтингу
CREATE INDEX idx_tutors_rating
    ON tutors(rating_avg DESC)
    WHERE approval_status = 'approved';

-- ============================================================
-- available_slots
-- ============================================================

-- Расписание тьютора — только активные слоты
CREATE INDEX idx_slots_tutor_active
    ON available_slots(tutor_id, day_of_week)
    WHERE is_active = true;

-- ============================================================
-- regular_schedules
-- ============================================================

-- Активные расписания тьютора
CREATE INDEX idx_schedules_tutor_active
    ON regular_schedules(tutor_id)
    WHERE is_active = true;

-- Активные расписания клиента
CREATE INDEX idx_schedules_client_active
    ON regular_schedules(client_id)
    WHERE is_active = true;

-- ============================================================
-- lessons
-- ============================================================

-- Все уроки клиента по дате (личный кабинет клиента)
CREATE INDEX idx_lessons_client_scheduled
    ON lessons(client_id, scheduled_at);

-- Все уроки тьютора по дате (личный кабинет тьютора)
CREATE INDEX idx_lessons_tutor_scheduled
    ON lessons(tutor_id, scheduled_at);

-- Cron: найти уроки которые нужно активировать / завершить
CREATE INDEX idx_lessons_status_scheduled
    ON lessons(status, scheduled_at);

-- Уроки из регулярного расписания
CREATE INDEX idx_lessons_recurring
    ON lessons(recurring_schedule_id)
    WHERE recurring_schedule_id IS NOT NULL;

-- Covering index для страницы урока (не лезет в таблицу)
CREATE INDEX idx_lessons_client_covering
    ON lessons(client_id, scheduled_at)
    INCLUDE (tutor_id, subject_id, status, type, duration_minutes);

-- ============================================================
-- lesson_materials
-- ============================================================

-- Материалы конкретного урока
CREATE INDEX idx_materials_lesson
    ON lesson_materials(lesson_id);

-- ============================================================
-- reviews
-- ============================================================

-- Отзывы о тьюторе (публичная страница)
CREATE INDEX idx_reviews_tutor
    ON reviews(tutor_id, created_at DESC);

-- ============================================================
-- tutor_subjects (available_subjects в Prisma)
-- ============================================================

-- Тьюторы по предмету (поиск)
CREATE INDEX idx_tutor_subjects_subject
    ON tutor_subjects(subject_id);

-- ============================================================
-- quiz_answers
-- ============================================================

-- Ответы клиента по уроку
CREATE INDEX idx_quiz_answers_lesson_client
    ON quiz_answers(lesson_id, client_id);

-- ============================================================
-- appeals
-- ============================================================

-- Открытые жалобы для админа
CREATE INDEX idx_appeals_status
    ON appeals(status, created_at)
    WHERE status = 'open';

-- ============================================================
-- email_verifications
-- ============================================================

-- Поиск по ссылке при подтверждении email
CREATE INDEX idx_email_verifications_link
    ON email_verifications(link);

-- ============================================================
-- password_resets
-- ============================================================

CREATE INDEX idx_password_resets_link
    ON password_resets(link);