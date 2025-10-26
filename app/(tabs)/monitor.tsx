import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Pause, Square, AlertCircle, Heart, Eye, Activity } from 'lucide-react-native';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

export default function MonitorScreen() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [wellnessScore, setWellnessScore] = useState(87);
  const [heartRate, setHeartRate] = useState(72);
  const [alertness, setAlertness] = useState(92);

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        setDistance((prev) => prev + 0.01);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const pulseStyle = useAnimatedStyle(() => {
    const scale = 1 + pulse.value * 0.1;
    return {
      transform: [{ scale }],
    };
  });

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#0F172A']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Live Monitoring</Text>
            <View style={[styles.statusBadge, isMonitoring && styles.statusActive]}>
              <View style={[styles.statusDot, isMonitoring && styles.dotActive]} />
              <Text style={styles.statusText}>
                {isMonitoring ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <GlassmorphicCard variant="primary" style={styles.mainCard}>
            <View style={styles.scoreContainer}>
              <Animated.View style={pulseStyle}>
                <View style={styles.scoreCircle}>
                  <LinearGradient
                    colors={['#10B981', '#34D399']}
                    style={styles.scoreGradient}>
                    <Text style={styles.scoreValue}>{wellnessScore}</Text>
                  </LinearGradient>
                </View>
              </Animated.View>
              <Text style={styles.scoreLabel}>Current Wellness</Text>
            </View>
          </GlassmorphicCard>

          <View style={styles.metricsRow}>
            <GlassmorphicCard style={styles.metricCard}>
              <Heart size={24} color="#EF4444" strokeWidth={2} />
              <Text style={styles.metricValue}>{heartRate}</Text>
              <Text style={styles.metricLabel}>BPM</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.metricCard}>
              <Eye size={24} color="#60A5FA" strokeWidth={2} />
              <Text style={styles.metricValue}>{alertness}%</Text>
              <Text style={styles.metricLabel}>Alert</Text>
            </GlassmorphicCard>
          </View>

          <GlassmorphicCard style={styles.tripCard}>
            <Text style={styles.tripTitle}>Trip Statistics</Text>
            <View style={styles.tripStats}>
              <View style={styles.tripStat}>
                <Text style={styles.tripStatLabel}>Duration</Text>
                <Text style={styles.tripStatValue}>{formatDuration(duration)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.tripStat}>
                <Text style={styles.tripStatLabel}>Distance</Text>
                <Text style={styles.tripStatValue}>{distance.toFixed(1)} km</Text>
              </View>
            </View>
          </GlassmorphicCard>

          {wellnessScore < 60 && (
            <GlassmorphicCard variant="danger" style={styles.alertCard}>
              <AlertCircle size={24} color="#EF4444" strokeWidth={2} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Low Wellness Detected</Text>
                <Text style={styles.alertText}>
                  Consider taking a break at the next safe location
                </Text>
              </View>
            </GlassmorphicCard>
          )}

          <View style={styles.controls}>
            {!isMonitoring ? (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setIsMonitoring(true)}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.buttonGradient}>
                  <Activity size={24} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.buttonText}>Start Monitoring</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.activeControls}>
                <TouchableOpacity
                  style={[styles.controlButton, styles.smallButton]}
                  onPress={() => setIsMonitoring(false)}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.buttonGradient}>
                    <Pause size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.buttonText}>Pause</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.smallButton]}
                  onPress={() => {
                    setIsMonitoring(false);
                    setDuration(0);
                    setDistance(0);
                  }}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.buttonGradient}>
                    <Square size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.buttonText}>Stop</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
  },
  dotActive: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  mainCard: {
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scoreGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
  tripCard: {
    marginBottom: 20,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tripStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripStat: {
    flex: 1,
  },
  tripStatLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 8,
  },
  tripStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
  },
  controls: {
    marginTop: 20,
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  smallButton: {
    flex: 1,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
