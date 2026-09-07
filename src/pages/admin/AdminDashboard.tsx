import { Link } from 'react-router-dom';
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
  ChevronLeft,
  Layers,
  Cpu,
  Palette,
  Rocket,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/constants';

const stats = [
  { label: 'Total Books', value: '1,248', icon: BookOpen, bg: 'bg-blue-500', link: 'View all books', href: ROUTES.ADMIN_BOOKS },
  { label: 'Total Members', value: '532', icon: Users, bg: 'bg-emerald-500', link: 'View all members', href: ROUTES.ADMIN_USERS },
  { label: 'Books Borrowed', value: '128', icon: ArrowLeftRight, bg: 'bg-orange-500', link: 'View transactions', href: ROUTES.ADMIN_BORROWS },
  { label: 'Overdue Books', value: '16', icon: Clock, bg: 'bg-purple-500', link: 'View overdue', href: ROUTES.ADMIN_BORROWS },
];

const overview = [
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 145 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 130 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 145 },
  { month: 'Jul', value: 110 },
  { month: 'Aug', value: 190 },
];

const recentlyBorrowed = [
  { title: 'Atomic Habits', by: 'Borrowed by John Doe', date: 'May 24, 2025', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=140&fit=crop' },
  { title: 'The Alchemist', by: 'Borrowed by Sarah Wilson', date: 'May 23, 2025', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&h=140&fit=crop' },
  { title: '1984', by: 'Borrowed by Michael Brown', date: 'May 22, 2025', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop' },
  { title: 'The Psychology of Money', by: 'Borrowed by Emily Johnson', date: 'May 21, 2025', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop' },
];

const recommended = [
  { title: 'The Power of Habit', author: 'Charles Duhigg', match: '95% Match', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop' },
  { title: 'The 5 AM Club', author: 'Robin Sharma', match: '92% Match', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=440&fit=crop' },
  { title: 'Deep Work', author: 'Cal Newport', match: '90% Match', cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=440&fit=crop' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', match: '88% Match', cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=440&fit=crop' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', match: '85% Match', cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=440&fit=crop' },
  { title: 'Educated', author: 'Tara Westover', match: '84% Match', cover: 'https://images.unsplash.com/photo-1518744946-13cbf4bfd3a3?w=300&h=440&fit=crop' },
];

const categories = [
  { label: 'Fiction', icon: Layers, bg: 'bg-violet-500' },
  { label: 'Technology', icon: Cpu, bg: 'bg-rose-400' },
  { label: 'Business', icon: Rocket, bg: 'bg-amber-400' },
  { label: 'Design', icon: Palette, bg: 'bg-teal-400' },
];

const updates = [
  { title: 'New book added: The Silent Patient', time: '2 hours ago' },
  { title: '12 new members joined this week', time: '5 hours ago' },
  { title: 'Overdue reminders sent to 16 members', time: '1 day ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
                <Link
                  to={stat.href}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
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
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-900">Overview</h2>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white">
                <option>This Year</option>
                <option>This Month</option>
                <option>This Week</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recently Borrowed Books</h2>
              <Link to={ROUTES.ADMIN_BORROWS} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentlyBorrowed.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <img src={item.cover} alt={item.title} className="w-9 h-12 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 truncate">{item.by}</p>
                  </div>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended For You */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recommended For You</h2>
            <Link to={ROUTES.BOOKS} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              View all recommendations
            </Link>
          </div>
          <div className="relative">
            <button className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow items-center justify-center text-slate-500 hover:text-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
              {recommended.map((book) => (
                <div key={book.title} className="flex flex-col">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full aspect-[3/4] rounded-lg object-cover mb-2"
                  />
                  <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{book.title}</p>
                  <p className="text-xs text-slate-400 mb-1">{book.author}</p>
                  <p className="text-xs font-medium text-emerald-600 mb-2">{book.match}</p>
                  <Button size="sm" variant="outline" className="text-xs h-8 border-blue-200 text-blue-600 hover:bg-blue-50">
                    Borrow
                  </Button>
                </div>
              ))}
            </div>
            <button className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow items-center justify-center text-slate-500 hover:text-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Categories + Library Updates */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Popular Categories</h2>
              <Link to={ROUTES.ADMIN_CATEGORIES} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-slate-600 text-center">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Library Updates</h2>
              <Link to={ROUTES.ADMIN} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {updates.map((u) => (
                <div key={u.title} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700">{u.title}</p>
                    <p className="text-xs text-slate-400">{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
