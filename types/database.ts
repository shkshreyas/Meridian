export interface Profile {
  id: string;
  display_name: string;
  total_trips: number;
  total_distance: number;
  average_wellness_score: number;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  distance: number;
  duration: number;
  wellness_score: number;
  alertness_score: number;
  stress_level: number;
  drowsiness_events: number;
  stress_events: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export interface WellnessSnapshot {
  id: string;
  trip_id: string;
  timestamp: string;
  heart_rate: number | null;
  alertness_score: number;
  stress_level: number;
  eye_closure_duration: number | null;
  head_position: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_value: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}
