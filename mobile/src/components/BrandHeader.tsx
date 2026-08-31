import { StyleSheet, View } from 'react-native';
import { SPACING } from '../constants/theme';
import { useI18n } from '../hooks/useI18n';
import { AppText } from './AppText';

export interface BrandHeaderProps {
  /** Optional trailing control, e.g. a link to Favorites. */
  right?: React.ReactNode;
}

/**
  * The wordmark: the product name set large with the company name smaller
  * beside it. Both come from the active locale, so a single line is never half
  * Latin and half Arabic script.
  */
export function BrandHeader({ right }: BrandHeaderProps) {
  const { t, isRtl } = useI18n();
  return (
    <View style={[styles.container, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
      <View style={styles.titleBlock}>
        <View style={[styles.titleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          <AppText variant="display" weight="bold">
            {t('common.appName')}
          </AppText>
          <AppText variant="label" weight="medium" tone="subtle" style={styles.byLine}>
            {t('common.company')}
          </AppText>
        </View>
        <AppText variant="caption" tone="muted" style={styles.tagline}>
          {t('common.tagline')}
        </AppText>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  titleBlock: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  byLine: {
    marginBottom: 2,
  },
  tagline: {
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
