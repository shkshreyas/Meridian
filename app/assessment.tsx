import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { Eye, Wind, Activity, CheckCircle } from 'lucide-react-native';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

type AssessmentStep = 'eye-tracking' | 'breathing' | 'posture' | 'complete';

export default function AssessmentScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('eye-tracking');
  const [progress, setProgress] = useState(0);

  const particleX = useSharedValue(0);
  const particleY = useSharedValue(0);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    if (currentStep === 'eye-tracking') {
      animateEyeTracking();
    } else if (currentStep === 'breathing') {
      animateBreathing();
    }
  }, [currentStep]);

  const animateEyeTracking = () => {
    const sequence = [
      withTiming(100, { duration: 1500 }),
      withTiming(-100, { duration: 1500 }),
      withTiming(0, { duration: 1500 }),
    ];
    particleX.value = withSequence(...sequence);

    const ySequence = [
      withTiming(-80, { duration: 1500 }),
      withTiming(80, { duration: 1500 }),
      withTiming(0, { duration: 1500 }),
    ];
    particleY.value = withSequence(...ySequence);
  };

  const animateBreathing = () => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  };

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: particleX.value },
      { translateY: particleY.value },
    ],
  }));

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const handleNext = () => {
    if (currentStep === 'eye-tracking') {
      setProgress(33);
      setCurrentStep('breathing');
    } else if (currentStep === 'breathing') {
      setProgress(66);
      setCurrentStep('posture');
    } else if (currentStep === 'posture') {
      setProgress(100);
      setCurrentStep('complete');
    } else {
      router.push('/(tabs)/monitor');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'eye-tracking':
        return (
          <View style={styles.stepContainer}>
            <Eye size={48} color="#60A5FA" strokeWidth={2} />
            <Text style={styles.stepTitle}>Eye Tracking Exercise</Text>
            <Text style={styles.stepDescription}>
              Follow the moving circle with your eyes only.{'\n'}Keep your head still.
            </Text>
            <View style={styles.exerciseArea}>
              <Animated.View style={[styles.particle, particleStyle]} />
            </View>
            <Text style={styles.timer}>15 seconds</Text>
          </View>
        );

      case 'breathing':
        return (
          <View style={styles.stepContainer}>
            <Wind size={48} color="#10B981" strokeWidth={2} />
            <Text style={styles.stepTitle}>Breathing Exercise</Text>
            <Text style={styles.stepDescription}>
              Breathe in as the circle expands.{'\n'}Breathe out as it contracts.
            </Text>
            <View style={styles.exerciseArea}>
              <Animated.View style={[styles.breathCircle, breathStyle]}>
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  style={styles.breathGradient}
                />
              </Animated.View>
            </View>
            <Text style={styles.timer}>30 seconds</Text>
          </View>
        );

      case 'posture':
        return (
          <View style={styles.stepContainer}>
            <Activity size={48} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.stepTitle}>Posture Check</Text>
            <Text style={styles.stepDescription}>
              Sit upright with your back straight.{'\n'}Adjust your seat and mirrors.
            </Text>
            <View style={styles.checklistContainer}>
              <GlassmorphicCard style={styles.checkItem}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.checkText}>Seat adjusted</Text>
              </GlassmorphicCard>
              <GlassmorphicCard style={styles.checkItem}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.checkText}>Mirrors aligned</Text>
              </GlassmorphicCard>
              <GlassmorphicCard style={styles.checkItem}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.checkText}>Comfortable posture</Text>
              </GlassmorphicCard>
            </View>
          </View>
        );

      case 'complete':
        return (
          <View style={styles.stepContainer}>
            <CheckCircle size={72} color="#10B981" strokeWidth={2} />
            <Text style={styles.completeTitle}>You're Ready!</Text>
            <Text style={styles.completeDescription}>
              Your baseline wellness metrics have been recorded.{'\n'}
              Drive safely!
            </Text>
            <GlassmorphicCard style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Alertness</Text>
                <Text style={styles.statValue}>94%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Readiness</Text>
                <Text style={styles.statValue}>Excellent</Text>
              </View>
            </GlassmorphicCard>
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#0F172A']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pre-Drive Assessment</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>
                {currentStep === 'complete' ? 'Start Monitoring' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  exerciseArea: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  particle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#60A5FA',
  },
  breathCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  breathGradient: {
    flex: 1,
  },
  timer: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  checklistContainer: {
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  completeDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  statsCard: {
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    padding: 20,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
