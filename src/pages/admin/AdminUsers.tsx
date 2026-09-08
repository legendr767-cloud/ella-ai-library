import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Users, UserCheck, UserX, BookOpen, Shield, GraduationCap, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

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
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: userService.getAllUsers,
  });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.student_id || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const summary = {
    total: users.length,
    students: users.filter((u) => u.role === 'student').length,
    librarians: users.filter((u) => u.role === 'librarian').length,
    suspended: users.filter((u) => u.is_suspended).length,
  };

  const handleToggleSuspend = async (userId: string, isSuspended: boolean) => {
    setPendingId(userId);
    try {
      await userService.setSuspended(userId, !isSuspended);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } finally {
      setPendingId(null);
    }
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setPendingId(userId);
    try {
      await userService.updateUserRole(userId, role);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-foreground">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all registered library users</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: summary.total, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Students', value: summary.students, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Librarians', value: summary.librarians, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Suspended', value: summary.suspended, icon: UserX, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
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
                {['all', 'student', 'librarian', 'admin'].map((r) => (
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
              Loading users...
            </div>
          ) : (
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
                  {filtered.map((user, index) => {
                    const isSelf = user.user_id === currentUser?.id;
                    const isPending = pendingId === user.user_id;
                    return (
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
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {user.full_name}
                                {isSelf && <span className="text-xs text-muted-foreground ml-1">(you)</span>}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {user.email || '—'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          {isSelf ? (
                            <Badge variant={roleVariant(user.role || 'student')} className="gap-1 capitalize">
                              {roleIcon(user.role || 'student')}
                              {user.role}
                            </Badge>
                          ) : (
                            <select
                              value={user.role || 'student'}
                              disabled={isPending}
                              onChange={(e) => handleRoleChange(user.user_id, e.target.value as UserRole)}
                              className="text-xs border border-input rounded-md px-2 py-1 bg-background text-foreground capitalize"
                            >
                              <option value="student">Student</option>
                              <option value="librarian">Librarian</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </td>
                        <td className="py-3 font-mono text-xs text-foreground">{user.student_id || '—'}</td>
                        <td className="py-3 text-sm text-muted-foreground">{user.department || '—'}</td>
                        <td className="py-3 font-medium text-foreground">{user.total_books_read}</td>
                        <td className="py-3 font-medium text-foreground">{user.active_borrows}</td>
                        <td className="py-3 text-sm text-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Badge variant={user.is_suspended ? 'destructive' : 'default'} className="capitalize">
                            {user.is_suspended ? 'Suspended' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSelf || isPending}
                              className={`gap-1 text-xs ${user.is_suspended ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                              onClick={() => handleToggleSuspend(user.user_id, !!user.is_suspended)}
                            >
                              {isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : user.is_suspended ? (
                                <UserCheck className="w-3 h-3" />
                              ) : (
                                <UserX className="w-3 h-3" />
                              )}
                              {user.is_suspended ? 'Activate' : 'Suspend'}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
