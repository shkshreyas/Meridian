import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Star, Map, Eye, Heart, Trophy, Flag, Brain } from 'lucide-react-native';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

const mockProfile = {
  displayName: 'Driver',
  totalTrips: 24,
  totalDistance: 567.3,
  averageWellness: 89,
  joinedDate: '2025-09-15',
};

const mockBadges = [
  {
    id: '1',
    name: 'First Journey',
    description: 'Complete your first monitored drive',
    icon: 'award',
    earned: true,
  },
  {
    id: '2',
    name: 'Safety Star',
    description: 'Complete 10 trips with perfect wellness scores',
    icon: 'star',
    earned: true,
  },
  {
    id: '3',
    name: 'Distance Warrior',
    description: 'Drive 500km with wellness monitoring',
    icon: 'map',
    earned: true,
  },
  {
    id: '4',
    name: 'Mindful Driver',
    description: 'Complete 5 pre-drive assessments',
    icon: 'brain',
    earned: false,
  },
  {
    id: '5',
    name: 'Stress Master',
    description: 'Maintain low stress for 10 consecutive trips',
    icon: 'heart',
    earned: false,
  },
  {
    id: '6',
    name: 'Alert Champion',
    description: 'Complete 20 trips without drowsiness events',
    icon: 'eye',
    earned: true,
  },
  {
    id: '7',
    name: 'Century Club',
    description: 'Complete 100 monitored trips',
    icon: 'trophy',
    earned: false,
  },
  {
    id: '8',
    name: 'Marathon Runner',
    description: 'Drive 1000km with wellness monitoring',
    icon: 'flag',
    earned: false,
  },
];

const iconMap: Record<string, any> = {
  award: Award,
  star: Star,
  map: Map,
  brain: Brain,
  heart: Heart,
  eye: Eye,
  trophy: Trophy,
  flag: Flag,
};

export default function ProfileScreen() {
  const earnedBadges = mockBadges.filter((b) => b.earned);
  const lockedBadges = mockBadges.filter((b) => !b.earned);

  const renderBadge = (badge: typeof mockBadges[0]) => {
    const Icon = iconMap[badge.icon];
    return (
      <GlassmorphicCard
        key={badge.id}
        variant={badge.earned ? 'primary' : 'default'}
        style={[styles.badgeCard, !badge.earned && styles.lockedBadge]}>
        <View style={[styles.badgeIcon, !badge.earned && styles.lockedIcon]}>
          <Icon
            size={32}
            color={badge.earned ? '#60A5FA' : '#4B5563'}
            strokeWidth={2}
          />
        </View>
        <Text style={[styles.badgeName, !badge.earned && styles.lockedText]}>
          {badge.name}
        </Text>
        <Text style={[styles.badgeDescription, !badge.earned && styles.lockedText]}>
          {badge.description}
        </Text>
      </GlassmorphicCard>
    );
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
            <Text style={styles.title}>Profile</Text>
          </View>

          <GlassmorphicCard variant="primary" style={styles.profileCard}>
            <View style={styles.avatar}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.avatarGradient}>
                <Text style={styles.avatarText}>
                  {mockProfile.displayName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.displayName}>{mockProfile.displayName}</Text>
            <Text style={styles.memberSince}>
              Member since {new Date(mockProfile.joinedDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </GlassmorphicCard>

          <View style={styles.statsGrid}>
            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{mockProfile.totalTrips}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{mockProfile.totalDistance.toFixed(0)}</Text>
              <Text style={styles.statLabel}>km Driven</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{mockProfile.averageWellness}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{earnedBadges.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </GlassmorphicCard>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trophy size={24} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>

            <Text style={styles.subsectionTitle}>
              Earned ({earnedBadges.length})
            </Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map(renderBadge)}
            </View>

            <Text style={styles.subsectionTitle}>
              Locked ({lockedBadges.length})
            </Text>
            <View style={styles.badgesGrid}>
              {lockedBadges.map(renderBadge)}
            </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    marginTop: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  badgeCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
  },
  lockedBadge: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedIcon: {
    backgroundColor: 'rgba(75, 85, 99, 0.2)',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  lockedText: {
    color: '#6B7280',
  },
});
