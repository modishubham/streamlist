import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useCallback} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBrandedHeader from '../components/common/AppBrandedHeader';
import {colors} from '../theme/colors';
import {radius, spacing, stitchLayout} from '../theme/spacing';
import {typography} from '../theme/typography';

function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const onChangeProfile = useCallback(() => {
    Alert.alert(
      'Change profile',
      'Profile editing will be available in a future update.',
    );
  }, []);

  const onSettings = useCallback(() => {
    Alert.alert(
      'Settings',
      'App settings will be available in a future update.',
    );
  }, []);

  const onLogout = useCallback(() => {
    Alert.alert(
      'Log out',
      'You are not signed in to a StreamList account on this device. Nothing will be cleared.',
      [{text: 'OK'}],
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBrandedHeader rightSlot={<View style={styles.headerSpacer} />} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: tabBarHeight + spacing['2xl']},
        ]}>
        <View style={styles.hero}>
          <View style={styles.avatar} accessibilityLabel="Profile photo">
            <Icon name="person" size={40} color={colors.on_surface_variant} />
          </View>
          <Text style={styles.displayName}>Guest</Text>
          <Text style={styles.subtitle}>Local watchlist on this device</Text>
        </View>

        <View style={styles.menuCard}>
          <MenuRow
            icon="edit"
            label="Change profile"
            onPress={onChangeProfile}
            showDivider
          />
          <MenuRow
            icon="settings"
            label="Settings"
            onPress={onSettings}
            showDivider
          />
          <MenuRow
            icon="logout"
            label="Log out"
            onPress={onLogout}
            destructive
            showDivider={false}
            trailing="none"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MENU_ICON_COL = 28;
const MENU_ROW_INDENT =
  spacing.md + MENU_ICON_COL + spacing.md;

function MenuRow({
  icon,
  label,
  onPress,
  showDivider,
  destructive,
  trailing = 'chevron',
}: {
  icon: string;
  label: string;
  onPress: () => void;
  showDivider: boolean;
  destructive?: boolean;
  trailing?: 'chevron' | 'none';
}) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({pressed}) => [styles.menuRow, pressed && styles.menuRowPressed]}
        accessibilityRole="button"
        accessibilityLabel={label}>
        <View style={styles.menuIconWrap}>
          <Icon
            name={icon}
            size={22}
            color={
              destructive ? colors.primary_container : colors.on_surface_variant
            }
          />
        </View>
        <Text
          style={[
            styles.menuLabel,
            destructive && styles.menuLabelDestructive,
          ]}>
          {label}
        </Text>
        {trailing === 'chevron' ? (
          <Icon
            name="chevron-right"
            size={22}
            color={colors.on_surface_variant}
          />
        ) : (
          <View style={styles.menuTrailingSpacer} />
        )}
      </Pressable>
      {showDivider ? (
        <View style={[styles.menuDivider, {marginLeft: MENU_ROW_INDENT}]} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: stitchLayout.screenGutter,
    paddingBottom: spacing['2xl'],
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface_container_highest,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  displayName: {
    ...typography.title_lg,
    fontWeight: '700',
    color: colors.on_surface,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  menuCard: {
    marginHorizontal: stitchLayout.screenGutter,
    borderRadius: radius.stitchLg,
    backgroundColor: colors.surface_container_low,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  menuRowPressed: {
    opacity: 0.75,
  },
  menuIconWrap: {
    width: MENU_ICON_COL,
    alignItems: 'center',
  },
  menuTrailingSpacer: {
    width: 22,
    height: 22,
  },
  menuLabel: {
    flex: 1,
    ...typography.title_sm,
    color: colors.on_surface,
  },
  menuLabelDestructive: {
    color: colors.primary_container,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline_variant,
  },
});

export default ProfileScreen;
