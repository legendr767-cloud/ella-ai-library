import { supabase } from '@/config/supabase';

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  booksBorrowed: number;
  overdueBooks: number;
}

export interface RecentBorrowRow {
  id: string;
  book_title: string;
  cover_image_url: string | null;
  borrower_name: string;
  borrow_date: string;
}

export interface RecentUpdate {
  id: string;
  title: string;
  time: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [{ count: totalBooks }, { count: totalMembers }, { count: booksBorrowed }, { count: overdueBooks }] =
      await Promise.all([
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('borrow_records').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('borrow_records').select('*', { count: 'exact', head: true }).eq('status', 'overdue'),
      ]);

    return {
      totalBooks: totalBooks || 0,
      totalMembers: totalMembers || 0,
      booksBorrowed: booksBorrowed || 0,
      overdueBooks: overdueBooks || 0,
    };
  },

  async getRecentBorrows(limit = 4): Promise<RecentBorrowRow[]> {
    const { data, error } = await supabase
      .from('borrow_records')
      .select('id, borrow_date, book:books(title, cover_image_url), user:profiles(full_name)')
      .order('borrow_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((r: any) => ({
      id: r.id,
      book_title: r.book?.title || 'Unknown book',
      cover_image_url: r.book?.cover_image_url || null,
      borrower_name: r.user?.full_name || 'Unknown user',
      borrow_date: r.borrow_date,
    }));
  },

  async getMonthlyBorrowTrend(): Promise<{ month: string; value: number }[]> {
    const since = new Date();
    since.setMonth(since.getMonth() - 7);

    const { data, error } = await supabase
      .from('borrow_records')
      .select('borrow_date')
      .gte('borrow_date', since.toISOString());

    if (error) throw error;

    const buckets = new Map<string, number>();
    const labels: string[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('en-US', { month: 'short' });
      labels.push(key);
      buckets.set(key, 0);
    }

    (data || []).forEach((r: { borrow_date: string }) => {
      const key = new Date(r.borrow_date).toLocaleString('en-US', { month: 'short' });
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    });

    return labels.map((month) => ({ month, value: buckets.get(month) || 0 }));
  },

  async getRecentUpdates(limit = 5): Promise<RecentUpdate[]> {
    const [{ data: recentBooks }, { data: recentUsers }] = await Promise.all([
      supabase.from('books').select('title, created_at').order('created_at', { ascending: false }).limit(limit),
      supabase
        .from('profiles')
        .select('full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
    ]);

    const updates: RecentUpdate[] = [
      ...(recentBooks || []).map((b: { title: string; created_at: string }) => ({
        id: `book-${b.title}-${b.created_at}`,
        title: `New book added: ${b.title}`,
        time: b.created_at,
      })),
      ...(recentUsers || []).map((u: { full_name: string; created_at: string }) => ({
        id: `user-${u.full_name}-${u.created_at}`,
        title: `${u.full_name} joined the library`,
        time: u.created_at,
      })),
    ];

    return updates
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  },
};
