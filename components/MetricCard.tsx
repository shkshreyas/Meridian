import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { GlassmorphicCard } from './GlassmorphicCard';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'primary' | 'danger' | 'success';
}

export function MetricCard({ icon: Icon, label, value, unit, variant = 'default' }: MetricCardProps) {
  return (
    <GlassmorphicCard variant={variant} style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon size={24} color="#60A5FA" strokeWidth={2} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unit: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});
