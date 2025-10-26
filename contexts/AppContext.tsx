import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, Trip, Badge, UserBadge } from '@/types/database';

interface AppContextType {
  profile: Profile | null;
  currentTrip: Trip | null;
  badges: Badge[];
  userBadges: UserBadge[];
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  refreshProfile: () => Promise<void>;
  refreshBadges: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshBadges = async () => {
    try {
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
        .order('created_at', { ascending: true });

      if (badgesData) {
        setBadges(badgesData);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userBadgesData } = await supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', user.id);

        if (userBadgesData) {
          setUserBadges(userBadgesData);
        }
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([refreshProfile(), refreshBadges()]);
      setLoading(false);
    };

    initialize();
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        currentTrip,
        badges,
        userBadges,
        loading,
        setProfile,
        setCurrentTrip,
        refreshProfile,
        refreshBadges,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
