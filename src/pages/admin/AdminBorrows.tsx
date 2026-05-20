import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookMarked, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BorrowEntry {
  id: number;
  user: string;
  userId: string;
  book: string;
  isbn: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  fine: number;
  renewals: number;
}

const today = new Date();
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const initialBorrows: BorrowEntry[] = [
  { id: 1, user: 'Alice Johnson', userId: 'STU001', book: 'The Great Gatsby', isbn: '9780743273565', borrowDate: daysFromNow(-10), dueDate: daysFromNow(4), status: 'active', fine: 0, renewals: 0 },
  { id: 2, user: 'Bob Smith', userId: 'STU002', book: '1984', isbn: '9780451524935', borrowDate: daysFromNow(-20), dueDate: daysFromNow(-6), status: 'overdue', fine: 3.00, renewals: 1 },
  { id: 3, user: 'David Lee', userId: 'STU003', book: 'To Kill a Mockingbird', isbn: '9780061935466', borrowDate: daysFromNow(-5), dueDate: daysFromNow(9), status: 'active', fine: 0, renewals: 0 },
  { id: 4, user: 'Eva Martinez', userId: 'STU004', book: 'Pride and Prejudice', isbn: '9780141439518', borrowDate: daysFromNow(-30), dueDate: daysFromNow(-16), returnDate: daysFromNow(-18), status: 'returned', fine: 0, renewals: 0 },
  { id: 5, user: 'Grace Kim', userId: 'STU006', book: 'Harry Potter', isbn: '9780439708180', borrowDate: daysFromNow(-8), dueDate: daysFromNow(6), status: 'active', fine: 0, renewals: 1 },
  { id: 6, user: 'Frank Chen', userId: 'STU005', book: 'The Hobbit', isbn: '9780547928227', borrowDate: daysFromNow(-25), dueDate: daysFromNow(-11), status: 'overdue', fine: 5.50, renewals: 2 },
  { id: 7, user: 'Alice Johnson', userId: 'STU001', book: 'Brave New World', isbn: '9780060850524', borrowDate: daysFromNow(-40), dueDate: daysFromNow(-26), returnDate: daysFromNow(-28), status: 'returned', fine: 0, renewals: 0 },
];

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'active') return 'default';
  if (status === 'returned') return 'secondary';
  return 'destructive';
};

const statusIcon = (status: string) => {
  if (status === 'active') return <Clock className="w-3 h-3" />;
  if (status === 'returned') return <CheckCircle className="w-3 h-3" />;
  return <AlertCircle className="w-3 h-3" />;
};

export default function AdminBorrows() {
  const [borrows, setBorrows] = useState<BorrowEntry[]>(initialBorrows);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = borrows.filter(b => {
    const matchSearch =
      b.user.toLowerCase().includes(search.toLowerCase()) ||
      b.book.toLowerCase().includes(search.toLowerCase()) ||
      b.userId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const markReturned = (id: number) => {
    setBorrows(borrows.map(b =>
      b.id === id ? { ...b, status: 'returned', returnDate: new Date().toISOString().split('T')[0] } : b
    ));
  };

  const totalFines = borrows.filter(b => b.status === 'overdue').reduce((s, b) => s + b.fine, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Manage Borrows</h1>
        <p className="text-muted-foreground">Track all borrow records, overdue books, and fines</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Borrows', value: borrows.length, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: BookMarked },
          { label: 'Active', value: borrows.filter(b => b.status === 'active').length, color: 'text-green-500', bg: 'bg-green-500/10', icon: Clock },
          { label: 'Overdue', value: borrows.filter(b => b.status === 'overdue').length, color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
          { label: 'Total Fines', value: `$${totalFines.toFixed(2)}`, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: RefreshCw },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Borrow Records</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {['all', 'active', 'overdue', 'returned'].map(s => (
                  <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)} className="capitalize">
                    {s}
                  </Button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Book</th>
                  <th className="pb-3 font-medium">Borrowed</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium">Returned</th>
                  <th className="pb-3 font-medium">Fine</th>
                  <th className="pb-3 font-medium">Renewals</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((borrow, index) => (
                  <motion.tr
                    key={borrow.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3">
                      <p className="font-medium">{borrow.user}</p>
                      <p className="text-xs text-muted-foreground font-mono">{borrow.userId}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-medium">{borrow.book}</p>
                      <p className="text-xs text-muted-foreground font-mono">{borrow.isbn}</p>
                    </td>
                    <td className="py-3">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                    <td className={`py-3 font-medium ${borrow.status === 'overdue' ? 'text-red-500' : ''}`}>
                      {new Date(borrow.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : '—'}</td>
                    <td className="py-3">
                      {borrow.fine > 0 ? (
                        <span className="text-red-500 font-medium">${borrow.fine.toFixed(2)}</span>
                      ) : '—'}
                    </td>
                    <td className="py-3">{borrow.renewals}</td>
                    <td className="py-3">
                      <Badge variant={statusVariant(borrow.status)} className="gap-1 capitalize">
                        {statusIcon(borrow.status)}
                        {borrow.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        {borrow.status !== 'returned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-xs text-green-600 hover:text-green-700"
                            onClick={() => markReturned(borrow.id)}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Returned
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No borrow records found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
