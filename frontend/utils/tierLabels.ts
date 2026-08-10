import type {
  TranslationKey,
} from '@/context/LanguageContext';

const tierTranslationKeys: Record<
  string,
  TranslationKey
> = {
  Platinum: 'platinum',
  Gold: 'gold',
  Silver: 'silver',
  Bronze: 'bronze',
  Borked: 'borked',
  Pending: 'pending',
};

export function getTierLabel(
  tier: string,
  t: (key: TranslationKey) => string
): string {
  const translationKey =
    tierTranslationKeys[tier];

  return translationKey
    ? t(translationKey)
    : tier;
}