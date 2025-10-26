import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassmorphicCardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'primary' | 'danger' | 'success';
}

export function GlassmorphicCard({ children, style, variant = 'default' }: GlassmorphicCardProps) {
  const gradientColors = {
    default: ['rgba(30, 41, 59, 0.7)', 'rgba(15, 23, 42, 0.5)'],
    primary: ['rgba(37, 99, 235, 0.3)', 'rgba(29, 78, 216, 0.2)'],
    danger: ['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.2)'],
    success: ['rgba(34, 197, 94, 0.3)', 'rgba(22, 163, 74, 0.2)'],
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.border}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
  },
  border: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
});
