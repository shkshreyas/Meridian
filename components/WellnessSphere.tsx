import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface WellnessSphereProps {
  wellnessScore: number;
  alertnessScore: number;
  stressLevel: number;
}

export function WellnessSphere({ wellnessScore, alertnessScore, stressLevel }: WellnessSphereProps) {
  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.05]);
    return {
      transform: [
        { scale },
        { rotateZ: `${rotation.value}deg` },
      ],
    };
  });

  const getGradientColors = () => {
    if (wellnessScore >= 80) {
      return ['#10B981', '#34D399', '#6EE7B7'];
    } else if (wellnessScore >= 60) {
      return ['#3B82F6', '#60A5FA', '#93C5FD'];
    } else if (wellnessScore >= 40) {
      return ['#F59E0B', '#FBBF24', '#FCD34D'];
    } else {
      return ['#EF4444', '#F87171', '#FCA5A5'];
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sphere, animatedStyle]}>
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <View style={styles.innerCircle} />
        </LinearGradient>
      </Animated.View>
      <View style={styles.glow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sphere: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
});
