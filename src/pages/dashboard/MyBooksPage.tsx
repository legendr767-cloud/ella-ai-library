import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Eye,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const mockBorrows = [
  {
    id: 1,
    book: {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    },
    borrowDate: '2026-04-25',
    dueDate: '2026-05-09',
    progress: 65,
    status: 'active',
    daysLeft: 3,
    renewals: 1,
    maxRenewals: 3,
  },
  {
    id: 2,
    book: {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    },
    borrowDate: '2026-04-20',
    dueDate: '2026-05-04',
    progress: 32,
    status: 'overdue',
    daysLeft: -2,
    renewals: 0,
    maxRenewals: 3,
  },
  {
    id: 3,
    book: {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    },
    borrowDate: '2026-05-01',
    dueDate: '2026-05-15',
    progress: 89,
    status: 'active',
    daysLeft: 9,
    renewals: 0,
    maxRenewals: 3,
  },
];

export default function MyBooksPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue'>('all');

  const filteredBorrows = mockBorrows.filter(borrow => {
    if (filter === 'all') return true;
    return borrow.status === filter;
  });

  const getStatusBadge = (status: string, daysLeft: number) => {
    if (status === 'overdue') {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Overdue</Badge>;
    }
    if (daysLeft <= 3) {
      return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Due Soon</Badge>;
    }
    return <Badge variant="default" className="gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Borrowed Books</h1>
        <p className="text-muted-foreground">Manage your active borrows and reading progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Borrows</p>
                <p className="text-3xl font-bold">{mockBorrows.filter(b => b.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                <p className="text-3xl font-bold">{mockBorrows.filter(b => b.status === 'overdue').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Progress</p>
                <p className="text-3xl font-bold">
                  {Math.round(mockBorrows.reduce((sum, b) => sum + b.progress, 0) / mockBorrows.length)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'overdue'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f} ({mockBorrows.filter(b => f === 'all' || b.status === f).length})
          </Button>
        ))}
      </div>

      {/* Books List */}
      <div className="space-y-4">
        {filteredBorrows.map((borrow, index) => (
          <motion.div
            key={borrow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={borrow.book.cover}
                    alt={borrow.book.title}
                    className="w-24 h-36 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link to={`/books/${borrow.book.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {borrow.book.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground">{borrow.book.author}</p>
                      </div>
                      {getStatusBadge(borrow.status, borrow.daysLeft)}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Reading Progress</span>
                        <span className="font-semibold">{borrow.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${borrow.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Borrowed</p>
                          <p className="font-medium">{new Date(borrow.borrowDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className={`font-medium ${borrow.status === 'overdue' ? 'text-red-500' : ''}`}>
                            {new Date(borrow.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Days Left */}
                    {borrow.status === 'overdue' ? (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          ⚠️ This book is {Math.abs(borrow.daysLeft)} days overdue. Please return it soon to avoid fines.
                        </p>
                      </div>
                    ) : borrow.daysLeft <= 3 ? (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                          ⏰ Due in {borrow.daysLeft} days. Consider renewing if you need more time.
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mb-4">
                        {borrow.daysLeft} days remaining
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/reader/${borrow.book.id}`}>
                        <Button size="sm" className="gap-2">
                          <BookOpen className="w-4 h-4" />
                          Continue Reading
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={borrow.renewals >= borrow.maxRenewals}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Renew ({borrow.renewals}/{borrow.maxRenewals})
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2">
                        Return Book
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBorrows.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "You haven't borrowed any books yet"
                : `No ${filter} books`}
            </p>
            <Link to="/books">
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" />
                Browse Books
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
