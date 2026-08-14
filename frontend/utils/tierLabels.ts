import type { Translate } from '@/context/LanguageContext';

export function getTierLabel(tier: string, t: Translate): string {
  switch (tier) {
    case 'Platinum':
      return t('platinum');
    case 'Gold':
      return t('gold');
    case 'Silver':
      return t('silver');
    case 'Bronze':
      return t('bronze');
    case 'Borked':
      return t('borked');
    case 'Pending':
    default:
      return t('pending');
  }
}

export function getTierDescription(tier: string, t: Translate): string {
  switch (tier) {
    case 'Platinum':
      return t('platinumDescription');
    case 'Gold':
      return t('goldDescription');
    case 'Silver':
      return t('silverDescription');
    case 'Bronze':
      return t('bronzeDescription');
    case 'Borked':
      return t('borkedDescription');
    case 'Pending':
    default:
      return t('pendingDescription');
  }
}