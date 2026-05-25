export type Role = 'client' | 'tutor' | 'admin';
export type AuthProvider = 'local' | 'google' | 'github';
export type LanguageCode = 'en' | 'de' | 'ru';

export interface User {
  id:              string;
  name:            string;
  surname:         string;
  username:        string;
  email:           string;
  avatarUrl:       string | null;
  roles:           Role[];
  activeRole:      Role;
  isEmailVerified: boolean;
  timezone:        string;
  languageCode:    LanguageCode;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id:         string;
    email:      string;
    name:       string;
    surname:    string;
    activeRole: Role;
  };
}