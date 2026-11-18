export type Locale = 'en' | 'pt' | 'es';
export type Country = 'us' | 'br' | 'cl';

export const LOCALES: {
  code: Locale;
  country: Country;
  native: string;
  region: string;
  short: string;
  htmlLang: string;
  intl: string;
}[] = [
  { code: 'en', country: 'us', native: 'English', region: 'United States', short: 'EN', htmlLang: 'en', intl: 'en-US' },
  { code: 'pt', country: 'br', native: 'Português', region: 'Brasil', short: 'PT', htmlLang: 'pt-BR', intl: 'pt-BR' },
  { code: 'es', country: 'cl', native: 'Español', region: 'Chile', short: 'ES', htmlLang: 'es-CL', intl: 'es-CL' },
];
