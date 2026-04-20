import React, {useEffect, useRef, useState} from 'react';
import {Animated, LayoutChangeEvent, StyleSheet, View, type ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../theme/colors';

export interface SkeletonBoxProps {
  width?: number | `${number}%` | '100%';
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Rounded placeholder with horizontal shimmer sweep (LinearGradient + Animated).
 */
function SkeletonBox({
  width: widthProp,
  height,
  borderRadius = 0,
  style,
}: SkeletonBoxProps) {
  const [layoutW, setLayoutW] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (layoutW <= 0) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, layoutW]);

  const onLayout = (e: LayoutChangeEvent) => {
    setLayoutW(e.nativeEvent.layout.width);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-layoutW * 0.6, layoutW * 1.2],
  });

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      onLayout={onLayout}
      style={[
        styles.base,
        {
          height,
          borderRadius,
          width: widthProp ?? '100%',
        },
        style,
      ]}>
      {layoutW > 0 ? (
        <View style={[styles.clip, {borderRadius}]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmerTrack,
              {
                width: layoutW * 2,
                transform: [{translateX}],
              },
            ]}>
            <LinearGradient
              colors={[
                colors.skeleton_base,
                colors.skeleton_shimmer,
                colors.skeleton_base,
              ]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.gradientFill}
            />
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.skeleton_base,
    overflow: 'hidden',
  },
  clip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  shimmerTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  gradientFill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default React.memo(SkeletonBox);
