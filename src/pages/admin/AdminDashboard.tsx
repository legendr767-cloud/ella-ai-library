import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  Clock,
  ChevronRight,
  BookMarked,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { ROUTES } from '@/config/constants';
import { dashboardService } from '@/services/dashboardService';
import { categoryService } from '@/services/categoryService';
import { bookService } from '@/services/bookService';
import { formatRelativeTime } from '@/utils/helpers';

const categoryAccents = ['bg-violet-500', 'bg-rose-400', 'bg-amber-400', 'bg-teal-400', 'bg-blue-500', 'bg-emerald-500'];

export default function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardService.getStats });
  const { data: trend = [] } = useQuery({ queryKey: ['dashboard-trend'], queryFn: dashboardService.getMonthlyBorrowTrend });
  const { data: recentBorrows = [] } = useQuery({
    queryKey: ['dashboard-recent-borrows'],
    queryFn: () => dashboardService.getRecentBorrows(4),
  });
  const { data: recentBooks = [] } = useQuery({
    queryKey: ['dashboard-recent-books'],
    queryFn: () => bookService.getRecentBooks(6),
  });
  const { data: categories = [] } = useQuery({ queryKey: ['dashboard-categories'], queryFn: categoryService.getCategories });
  const { data: updates = [] } = useQuery({
    queryKey: ['dashboard-updates'],
    queryFn: () => dashboardService.getRecentUpdates(5),
  });

  const statCards = [
    { label: 'Total Books', value: stats?.totalBooks ?? 0, icon: BookOpen, bg: 'bg-blue-500', link: 'View all books', href: ROUTES.ADMIN_BOOKS },
    { label: 'Total Members', value: stats?.totalMembers ?? 0, icon: Users, bg: 'bg-emerald-500', link: 'View all members', href: ROUTES.ADMIN_USERS },
    { label: 'Books Borrowed', value: stats?.booksBorrowed ?? 0, icon: ArrowLeftRight, bg: 'bg-orange-500', link: 'View transactions', href: ROUTES.ADMIN_BORROWS },
    { label: 'Overdue Books', value: stats?.overdueBooks ?? 0, icon: Clock, bg: 'bg-purple-500', link: 'View overdue', href: ROUTES.ADMIN_BORROWS },
  ];

  const topCategories = [...categories].sort((a, b) => b.book_count - a.book_count).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-5">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mb-2">{stat.value}</p>
                <Link
                  to={stat.href}
                  className="text-xs font-medium text-primary hover:opacity-80 inline-flex items-center gap-1"
                >
                  {stat.link} <ChevronRight className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overview + Recently Borrowed */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground">Borrow Activity</h2>
              <span className="text-xs text-muted-foreground">Last 8 months</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeOpacity={0.15} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--popover))',
                      color: 'hsl(var(--popover-foreground))',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recently Borrowed Books</h2>
              <Link to={ROUTES.ADMIN_BORROWS} className="text-xs font-medium text-primary hover:opacity-80">
                View all
              </Link>
            </div>
            {recentBorrows.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No borrows yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentBorrows.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.book_title} className="w-9 h-12 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.book_title}</p>
                      <p className="text-xs text-muted-foreground truncate">Borrowed by {item.borrower_name}</p>
                    </div>
                    <span className="text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      {formatRelativeTime(item.borrow_date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recently Added Books */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recently Added Books</h2>
            <Link to={ROUTES.ADMIN_BOOKS} className="text-xs font-medium text-primary hover:opacity-80">
              Manage books
            </Link>
          </div>
          {recentBooks.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No books in the catalog yet.{' '}
              <Link to={ROUTES.ADMIN_BOOKS} className="text-primary hover:opacity-80 font-medium">
                Add your first book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
              {recentBooks.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="flex flex-col group">
                  <div className="w-full aspect-[3/4] rounded-lg bg-muted overflow-hidden mb-2">
                    {book.cover_image_url ? (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{book.title}</p>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Categories + Library Updates */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Popular Categories</h2>
              <Link to={ROUTES.ADMIN_CATEGORIES} className="text-xs font-medium text-primary hover:opacity-80">
                View all
              </Link>
            </div>
            {topCategories.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No categories yet</div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {topCategories.map((cat, i) => (
                  <Link key={cat.id} to={ROUTES.ADMIN_CATEGORIES} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl ${categoryAccents[i % categoryAccents.length]} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">{cat.book_count}</span>
                    </div>
                    <span className="text-xs text-muted-foreground text-center truncate w-full">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Library Updates</h2>
            </div>
            {updates.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No recent activity</div>
            ) : (
              <div className="space-y-4">
                {updates.map((u) => (
                  <div key={u.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{u.title}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(u.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
