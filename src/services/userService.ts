import { supabase } from '@/config/supabase';
import { Profile, UserRole } from '@/types';

export interface AdminUserRow extends Profile {
  active_borrows: number;
}

export const userService = {
  /**
   * Get every registered user (profile), with their active borrow count.
   * RLS allows any authenticated client to read all profiles.
   */
  async getAllUsers(): Promise<AdminUserRow[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: activeBorrows } = await supabase
      .from('borrow_records')
      .select('user_id')
      .eq('status', 'active');

    const counts = new Map<string, number>();
    (activeBorrows || []).forEach((b: { user_id: string }) => {
      counts.set(b.user_id, (counts.get(b.user_id) || 0) + 1);
    });

    return (profiles || []).map((p: Profile) => ({
      ...p,
      active_borrows: counts.get(p.user_id) || 0,
    }));
  },

  /**
   * Get counts for the dashboard summary cards.
   */
  async getUserStats(): Promise<{ total: number; students: number; librarians: number; suspended: number }> {
    const { data, error } = await supabase.from('profiles').select('role, is_suspended');
    if (error) throw error;

    const rows = data || [];
    return {
      total: rows.length,
      students: rows.filter((r) => r.role === 'student').length,
      librarians: rows.filter((r) => r.role === 'librarian').length,
      suspended: rows.filter((r) => r.is_suspended).length,
    };
  },

  /**
   * Change a user's role. Runs through a SECURITY DEFINER function so the
   * change updates their real auth session (not just the profile row) —
   * only callable by an existing admin.
   */
  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase.rpc('admin_update_user_role', {
      target_user_id: userId,
      new_role: role,
    });
    if (error) throw error;
  },

  /**
   * Suspend or reactivate a user.
   */
  async setSuspended(userId: string, isSuspended: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_suspended: isSuspended })
      .eq('user_id', userId);
    if (error) throw error;
  },
};
