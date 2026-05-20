import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Profile } from '@/types';
import { supabase } from '@/config/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();

            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                role: (data.user.user_metadata?.role || 'student') as any,
                created_at: data.user.created_at,
                updated_at: data.user.updated_at || data.user.created_at,
              },
              profile: profile || null,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, fullName) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: 'student',
              },
            },
          });

          if (error) throw error;

          if (data.session && data.user) {
            // Profile is auto-created by DB trigger on_auth_user_created
            // Wait briefly for the trigger to execute, then fetch
            await new Promise((resolve) => setTimeout(resolve, 800));

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();

            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                role: 'student',
                created_at: data.user.created_at,
                updated_at: data.user.updated_at || data.user.created_at,
              },
              profile: profile || null,
              isAuthenticated: true,
            });
          } else if (data.user && !data.session) {
            // Email confirmation required — account created but not yet active
            throw new Error('Account created! Please check your email to confirm your account, then sign in.');
          }
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },

      updateProfile: async (data) => {
        try {
          const { user, profile } = get();
          if (!user || !profile) throw new Error('Not authenticated');

          const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', profile.id)
            .select()
            .single();

          if (error) throw error;

          set({ profile: updatedProfile });
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          // Skip auth check if Supabase is not configured (demo mode)
          if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your_supabase')) {
            console.log('Running in demo mode without backend');
            set({ isLoading: false });
            return;
          }
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            set({
              user: session.user,
              profile: profile || null,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Check auth error:', error);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
