import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SkeletonFooterStrip from '../skeleton/SkeletonFooterStrip';
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
    <View style={styles.wrap}>
      <SkeletonFooterStrip />
      <Text style={styles.label}>LOADING MORE CONTENT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  label: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
});

export default React.memo(HomeLoadingFooter);
