import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, UserCheck, UserX, BookOpen, Shield, GraduationCap, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserEntry {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'librarian' | 'student';
  studentId?: string;
  department?: string;
  booksRead: number;
  activeBorrows: number;
  joinDate: string;
  status: 'active' | 'suspended';
}

const initialUsers: UserEntry[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'student', studentId: 'STU001', department: 'Computer Science', booksRead: 24, activeBorrows: 2, joinDate: '2025-09-01', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'student', studentId: 'STU002', department: 'Literature', booksRead: 18, activeBorrows: 3, joinDate: '2025-09-03', status: 'active' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'librarian', department: 'Library Staff', booksRead: 0, activeBorrows: 0, joinDate: '2024-01-15', status: 'active' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'student', studentId: 'STU003', department: 'History', booksRead: 31, activeBorrows: 1, joinDate: '2025-09-05', status: 'active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'student', studentId: 'STU004', department: 'Physics', booksRead: 12, activeBorrows: 0, joinDate: '2025-09-10', status: 'active' },
  { id: 6, name: 'Frank Chen', email: 'frank@example.com', role: 'student', studentId: 'STU005', department: 'Engineering', booksRead: 9, activeBorrows: 2, joinDate: '2025-09-12', status: 'suspended' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'student', studentId: 'STU006', department: 'Biology', booksRead: 45, activeBorrows: 3, joinDate: '2025-08-20', status: 'active' },
  { id: 8, name: 'Admin User', email: 'admin@library.com', role: 'admin', department: 'Administration', booksRead: 0, activeBorrows: 0, joinDate: '2024-01-01', status: 'active' },
];

const roleIcon = (role: string) => {
  if (role === 'admin') return <Shield className="w-3 h-3" />;
  if (role === 'librarian') return <BookOpen className="w-3 h-3" />;
  return <GraduationCap className="w-3 h-3" />;
};

const roleVariant = (role: string): 'default' | 'secondary' | 'outline' => {
  if (role === 'admin') return 'default';
  if (role === 'librarian') return 'secondary';
  return 'outline';
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserEntry[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.studentId || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleSuspend = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all registered library users</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Librarians', value: users.filter(u => u.role === 'librarian').length, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, icon: UserX, color: 'text-red-500', bg: 'bg-red-500/10' },
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
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {['all', 'student', 'librarian', 'admin'].map(r => (
                  <Button
                    key={r}
                    size="sm"
                    variant={roleFilter === r ? 'default' : 'outline'}
                    onClick={() => setRoleFilter(r)}
                    className="capitalize"
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
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
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Student ID</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Books Read</th>
                  <th className="pb-3 font-medium">Active Borrows</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={roleVariant(user.role)} className="gap-1 capitalize">
                        {roleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono text-xs">{user.studentId || '—'}</td>
                    <td className="py-3 text-sm text-muted-foreground">{user.department || '—'}</td>
                    <td className="py-3 font-medium">{user.booksRead}</td>
                    <td className="py-3 font-medium">{user.activeBorrows}</td>
                    <td className="py-3 text-sm">{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`gap-1 text-xs ${user.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                          onClick={() => toggleSuspend(user.id)}
                        >
                          {user.status === 'active' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
