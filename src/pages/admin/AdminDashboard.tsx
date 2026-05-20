import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  BookMarked,
  AlertCircle,
  TrendingUp,
  DollarSign,
  UserPlus,
  BarChart3,
  ChevronRight,
  Clock,
  CheckCircle,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const stats = [
  { label: 'Total Users', value: '1,284', change: '+12%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Total Books', value: '3,456', change: '+8%', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Active Borrows', value: '342', change: '+5%', icon: BookMarked, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Overdue Books', value: '28', change: '-3%', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Revenue (Month)', value: '$1,920', change: '+18%', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { label: 'New Users (Month)', value: '94', change: '+22%', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Avg. Rating', value: '4.6', change: '+0.2', icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Books Added', value: '127', change: '+15%', icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-500/10' },
];

const recentActivity = [
  { id: 1, type: 'borrow', user: 'Alice Johnson', book: 'The Great Gatsby', time: '2 min ago', status: 'active' },
  { id: 2, type: 'return', user: 'Bob Smith', book: '1984', time: '15 min ago', status: 'returned' },
  { id: 3, type: 'register', user: 'Carol Williams', book: '', time: '1 hour ago', status: 'new' },
  { id: 4, type: 'overdue', user: 'David Lee', book: 'Pride and Prejudice', time: '2 hours ago', status: 'overdue' },
  { id: 5, type: 'borrow', user: 'Eva Martinez', book: 'The Hobbit', time: '3 hours ago', status: 'active' },
  { id: 6, type: 'return', user: 'Frank Chen', book: 'Harry Potter', time: '5 hours ago', status: 'returned' },
];

const topBooks = [
  { id: 1, title: 'The Great Gatsby', borrows: 145, rating: 4.5 },
  { id: 2, title: 'Harry Potter', borrows: 132, rating: 4.9 },
  { id: 3, title: '1984', borrows: 118, rating: 4.7 },
  { id: 4, title: 'The Hobbit', borrows: 104, rating: 4.8 },
  { id: 5, title: 'To Kill a Mockingbird', borrows: 98, rating: 4.8 },
];

const activityIcon = (type: string) => {
  switch (type) {
    case 'borrow': return <BookMarked className="w-4 h-4 text-purple-500" />;
    case 'return': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'register': return <UserPlus className="w-4 h-4 text-purple-500" />;
    case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: 'default',
    returned: 'outline',
    new: 'secondary',
    overdue: 'destructive',
  };
  return <Badge variant={(map[status] || 'outline') as any} className="text-xs capitalize">{status}</Badge>;
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of library activity and statistics</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isNegative = stat.change.startsWith('-');
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link to="/admin/borrows">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {activityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.user}</p>
                    {item.book && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.type === 'borrow' ? 'Borrowed' : item.type === 'return' ? 'Returned' : ''} "{item.book}"
                      </p>
                    )}
                    {!item.book && <p className="text-xs text-muted-foreground">New user registered</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(item.status)}
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Borrowed Books */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Borrowed Books</CardTitle>
              <Link to="/admin/books">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={book.id} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{book.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(book.borrows / 150) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{book.borrows} borrows</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{book.rating}</span>
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
