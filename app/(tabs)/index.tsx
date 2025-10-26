import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Heart, Eye, Brain, TrendingUp } from 'lucide-react-native';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';
import { WellnessSphere } from '@/components/WellnessSphere';
import { MetricCard } from '@/components/MetricCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [wellnessData] = useState({
    wellnessScore: 87,
    alertnessScore: 92,
    stressLevel: 23,
    heartRate: 72,
  });

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#0F172A']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.title}>Ready to Drive?</Text>
          </View>

          <View style={styles.sphereContainer}>
            <WellnessSphere
              wellnessScore={wellnessData.wellnessScore}
              alertnessScore={wellnessData.alertnessScore}
              stressLevel={wellnessData.stressLevel}
            />
            <Text style={styles.scoreText}>{wellnessData.wellnessScore}</Text>
            <Text style={styles.scoreLabel}>Wellness Score</Text>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard
              icon={Eye}
              label="Alertness"
              value={wellnessData.alertnessScore}
              unit="%"
              variant="success"
            />
            <MetricCard
              icon={Heart}
              label="Heart Rate"
              value={wellnessData.heartRate}
              unit="bpm"
              variant="primary"
            />
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard
              icon={Brain}
              label="Stress"
              value={wellnessData.stressLevel}
              unit="%"
              variant={wellnessData.stressLevel > 50 ? 'danger' : 'default'}
            />
            <MetricCard
              icon={TrendingUp}
              label="Trend"
              value="Stable"
              variant="success"
            />
          </View>

          <GlassmorphicCard style={styles.actionCard}>
            <Text style={styles.actionTitle}>Start Your Journey</Text>
            <Text style={styles.actionDescription}>
              Complete a quick wellness check before hitting the road
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/assessment')}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}>
                <Play size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.buttonText}>Begin Pre-Drive Check</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassmorphicCard>
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
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  sphereContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    marginTop: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
