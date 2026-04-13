import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface HomeLoadingFooterProps {
  visible: boolean;
  loading: boolean;
}

function HomeLoadingFooter({visible, loading}: HomeLoadingFooterProps) {
  if (!visible || !loading) {
    return null;
  }
  return (
    <View style={styles.row}>
      <ActivityIndicator color={colors.primary_container} size="small" />
      <Text style={styles.label}>LOADING MORE CONTENT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.label_sm,
    color: colors.on_surface,
    textTransform: 'uppercase',
  },
});

export default React.memo(HomeLoadingFooter);
