export const SUBJECTS = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        nameDe: 'Mathematik',
        nameRu: 'Математика',
        nameEn: 'Mathematics',
        icon: '📐',
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        nameDe: 'Deutsch',
        nameRu: 'Немецкий',
        nameEn: 'German',
        icon: '📖',
    },
];
export const getSubjectName = (subject, lang) => {
    if (lang === 'ru')
        return subject.nameRu;
    if (lang === 'en')
        return subject.nameEn;
    return subject.nameDe;
};
