import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const monthlyData = [
  { month: 'Jan', borrows: 240, returns: 220, newUsers: 45 },
  { month: 'Feb', borrows: 310, returns: 290, newUsers: 52 },
  { month: 'Mar', borrows: 280, returns: 270, newUsers: 38 },
  { month: 'Apr', borrows: 395, returns: 360, newUsers: 67 },
  { month: 'May', borrows: 420, returns: 400, newUsers: 74 },
  { month: 'Jun', borrows: 380, returns: 370, newUsers: 59 },
  { month: 'Jul', borrows: 290, returns: 280, newUsers: 41 },
  { month: 'Aug', borrows: 350, returns: 330, newUsers: 55 },
  { month: 'Sep', borrows: 460, returns: 440, newUsers: 88 },
  { month: 'Oct', borrows: 500, returns: 480, newUsers: 94 },
  { month: 'Nov', borrows: 430, returns: 410, newUsers: 72 },
  { month: 'Dec', borrows: 370, returns: 350, newUsers: 63 },
];

const categoryData = [
  { name: 'Fiction', value: 1250, color: '#6366f1' },
  { name: 'Non-Fiction', value: 890, color: '#22c55e' },
  { name: 'Science', value: 654, color: '#a855f7' },
  { name: 'Technology', value: 432, color: '#f97316' },
  { name: 'History', value: 345, color: '#ef4444' },
  { name: 'Others', value: 885, color: '#94a3b8' },
];

const topGenresBorrows = [
  { genre: 'Fiction', borrows: 1840 },
  { genre: 'Fantasy', borrows: 1230 },
  { genre: 'Sci-Fi', borrows: 980 },
  { genre: 'History', borrows: 760 },
  { genre: 'Romance', borrows: 640 },
  { genre: 'Non-Fiction', borrows: 580 },
];

const kpis = [
  { label: 'Borrow Rate', value: '87%', change: '+5%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Return Rate', value: '94%', change: '+2%', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'User Retention', value: '78%', change: '+8%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Monthly Revenue', value: '$1,920', change: '+18%', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<'6m' | '12m'>('12m');
  const displayData = period === '6m' ? monthlyData.slice(6) : monthlyData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground">Library performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={period === '6m' ? 'default' : 'outline'} onClick={() => setPeriod('6m')}>6 Months</Button>
          <Button size="sm" variant={period === '12m' ? 'default' : 'outline'} onClick={() => setPeriod('12m')}>12 Months</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <span className="text-xs font-medium text-green-500">{kpi.change}</span>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Borrows & Returns Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Borrows & Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrows" name="Borrows" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returns" name="Returns" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* New Users Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              New User Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={displayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Books by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-medium">{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Genres by Borrows */}
      <Card>
        <CardHeader>
          <CardTitle>Top Genres by Borrow Count</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topGenresBorrows} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="genre" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="borrows" name="Borrows" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
