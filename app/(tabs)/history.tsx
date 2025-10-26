import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp, Award, MapPin } from 'lucide-react-native';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

const mockTrips = [
  {
    id: '1',
    date: '2025-10-25',
    time: '14:30',
    duration: '1h 23m',
    distance: '45.2 km',
    wellnessScore: 92,
    alertness: 95,
    stressLevel: 15,
  },
  {
    id: '2',
    date: '2025-10-24',
    time: '09:15',
    duration: '0h 45m',
    distance: '28.7 km',
    wellnessScore: 88,
    alertness: 90,
    stressLevel: 22,
  },
  {
    id: '3',
    date: '2025-10-23',
    time: '17:45',
    duration: '2h 10m',
    distance: '87.5 km',
    wellnessScore: 85,
    alertness: 87,
    stressLevel: 28,
  },
  {
    id: '4',
    date: '2025-10-22',
    time: '12:00',
    duration: '0h 30m',
    distance: '18.3 km',
    wellnessScore: 94,
    alertness: 96,
    stressLevel: 12,
  },
];

export default function HistoryScreen() {
  const totalTrips = mockTrips.length;
  const totalDistance = mockTrips.reduce((sum, trip) => sum + parseFloat(trip.distance), 0);
  const avgWellness = mockTrips.reduce((sum, trip) => sum + trip.wellnessScore, 0) / totalTrips;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
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
            <Text style={styles.title}>Journey History</Text>
            <Text style={styles.subtitle}>Your driving wellness timeline</Text>
          </View>

          <View style={styles.statsRow}>
            <GlassmorphicCard style={styles.statCard}>
              <Calendar size={24} color="#60A5FA" strokeWidth={2} />
              <Text style={styles.statValue}>{totalTrips}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <MapPin size={24} color="#10B981" strokeWidth={2} />
              <Text style={styles.statValue}>{totalDistance.toFixed(0)}</Text>
              <Text style={styles.statLabel}>km Driven</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <TrendingUp size={24} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.statValue}>{avgWellness.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </GlassmorphicCard>
          </View>

          <View style={styles.timelineHeader}>
            <View style={styles.timelineLine} />
            <Text style={styles.timelineTitle}>Recent Trips</Text>
          </View>

          {mockTrips.map((trip, index) => (
            <View key={trip.id} style={styles.tripItem}>
              <View style={styles.timelineDot} />
              {index < mockTrips.length - 1 && <View style={styles.timelineConnector} />}

              <GlassmorphicCard style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                    <Text style={styles.tripTime}>{trip.time}</Text>
                  </View>
                  <View
                    style={[
                      styles.scoreBadge,
                      { backgroundColor: `${getScoreColor(trip.wellnessScore)}33` },
                    ]}>
                    <Text
                      style={[
                        styles.scoreBadgeText,
                        { color: getScoreColor(trip.wellnessScore) },
                      ]}>
                      {trip.wellnessScore}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripMetrics}>
                  <View style={styles.tripMetric}>
                    <Text style={styles.metricLabel}>Duration</Text>
                    <Text style={styles.metricValue}>{trip.duration}</Text>
                  </View>
                  <View style={styles.tripMetric}>
                    <Text style={styles.metricLabel}>Distance</Text>
                    <Text style={styles.metricValue}>{trip.distance}</Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Alertness</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${trip.alertness}%`,
                            backgroundColor: getScoreColor(trip.alertness),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.detailValue}>{trip.alertness}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Stress</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${trip.stressLevel}%`,
                            backgroundColor: '#F59E0B',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.detailValue}>{trip.stressLevel}%</Text>
                  </View>
                </View>
              </GlassmorphicCard>
            </View>
          ))}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
  },
  timelineHeader: {
    position: 'relative',
    marginBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    top: 12,
    width: 40,
    height: 2,
    backgroundColor: '#3B82F6',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingLeft: 48,
  },
  tripItem: {
    position: 'relative',
    marginBottom: 24,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 28,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#0F172A',
    zIndex: 2,
  },
  timelineConnector: {
    position: 'absolute',
    left: 5.5,
    top: 40,
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    zIndex: 1,
  },
  tripCard: {
    marginLeft: 28,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tripTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreBadgeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  tripMetrics: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tripMetric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    width: 60,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  detailValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});
