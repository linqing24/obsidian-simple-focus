import en from './en';
import zh from './zh';

const langs = {
  en,
  zh,
}
export type Lang = typeof langs.en;
export default langs