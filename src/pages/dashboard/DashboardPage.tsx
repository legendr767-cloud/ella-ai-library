import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as m } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Clock,
  TrendingUp,
  Award,
  Target,
  Flame,
  Star,
  Calendar,
  BarChart3,
  Trophy,
  Zap,
  BookMarked,
  Timer,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Mock data
const stats = {
  activeBorrows: 3,
  booksRead: 24,
  readingStreak: 7,
  totalPages: 5420,
  readingGoal: 50,
  currentProgress: 24,
  hoursRead: 48,
  averageRating: 4.2,
};

const currentlyReading = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    progress: 65,
    dueDate: '3 days',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    progress: 32,
    dueDate: '5 days',
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    progress: 89,
    dueDate: '1 day',
  },
];

const recentAchievements = [
  { id: 1, name: 'Bookworm', description: 'Read 20 books', icon: '📚', unlocked: true },
  { id: 2, name: 'Speed Reader', description: 'Finish a book in 24h', icon: '⚡', unlocked: true },
  { id: 3, name: 'Dedicated', description: '7 day reading streak', icon: '🔥', unlocked: true },
  { id: 4, name: 'Critic', description: 'Write 10 reviews', icon: '⭐', unlocked: false },
];

const readingActivity = [
  { date: 'Mon', pages: 45 },
  { date: 'Tue', pages: 62 },
  { date: 'Wed', pages: 38 },
  { date: 'Thu', pages: 71 },
  { date: 'Fri', pages: 54 },
  { date: 'Sat', pages: 89 },
  { date: 'Sun', pages: 67 },
];

const recommendations = [
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.6,
    reason: 'Based on your reading history',
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop',
    rating: 4.8,
    reason: 'Popular in Fiction',
  },
];

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goalInput, setGoalInput] = useState(stats.readingGoal.toString());
  const [savedGoal, setSavedGoal] = useState(stats.readingGoal);
  const { profile, user } = useAuthStore();

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Reader';

  const liveStats = {
    ...stats,
    booksRead: profile?.total_books_read ?? stats.booksRead,
    readingStreak: profile?.reading_streak ?? stats.readingStreak,
    readingGoal: savedGoal,
    currentProgress: profile?.total_books_read ?? stats.currentProgress,
  };

  const maxPages = Math.max(...readingActivity.map(d => d.pages));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here's your reading progress</p>
        </div>
        <Button className="gap-2" onClick={() => { setGoalInput(savedGoal.toString()); setShowGoalsModal(true); }}>
          <Target className="w-4 h-4" />
          Set Goals
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Currently Reading</p>
                  <p className="text-3xl font-bold">{liveStats.activeBorrows}</p>
                  <p className="text-xs text-muted-foreground mt-1">books</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Books Completed</p>
                  <p className="text-3xl font-bold">{liveStats.booksRead}</p>
                  <p className="text-xs text-green-500 mt-1">↑ 12% this month</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reading Streak</p>
                  <p className="text-3xl font-bold">{liveStats.readingStreak}</p>
                  <p className="text-xs text-muted-foreground mt-1">days in a row</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pages Read</p>
                  <p className="text-3xl font-bold">{liveStats.totalPages.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">total pages</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BookMarked className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>2026 Reading Goal</CardTitle>
                <Badge variant="outline">{liveStats.currentProgress}/{liveStats.readingGoal} books</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{Math.round((liveStats.currentProgress / liveStats.readingGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(liveStats.currentProgress / liveStats.readingGoal) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  You're {liveStats.readingGoal - liveStats.currentProgress} books away from your goal! Keep it up! 🎯
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Currently Reading */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Currently Reading</CardTitle>
                <Link to="/dashboard/my-books">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentlyReading.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{book.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Due in {book.dueDate}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Continue
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Reading Activity Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reading Activity</CardTitle>
                <div className="flex gap-2">
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className="capitalize"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-2 h-48">
                  {readingActivity.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.pages / maxPages) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="w-full bg-gradient-to-t from-primary to-purple-500 rounded-t-lg min-h-[20px] relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.pages} pages
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Average: </span>
                    <span className="font-semibold">58 pages/day</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-semibold">426 pages this week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className={`p-3 rounded-lg border-2 ${achievement.unlocked ? 'border-primary bg-primary/5' : 'border-dashed border-muted-foreground/30 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="default" className="text-xs">New!</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
              <Link to="/dashboard/achievements">
                <Button variant="outline" className="w-full gap-2">
                  <Trophy className="w-4 h-4" />
                  View All Achievements
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{book.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{book.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">{book.reason}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
              <Link to="/books">
                <Button variant="outline" className="w-full gap-2">
                  Explore More Books
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reading Time</span>
                <span className="font-semibold">{liveStats.hoursRead}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Rating Given</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{liveStats.averageRating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Favorite Genre</span>
                <Badge variant="outline">Fiction</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Books This Month</span>
                <span className="font-semibold">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Set Goals Modal */}
      <AnimatePresence>
        {showGoalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowGoalsModal(false)} />
            <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background rounded-xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Reading Goal</h2>
                <button onClick={() => setShowGoalsModal(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Books to read in 2026</label>
                  <input
                    type="number" min="1" max="365"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[12, 24, 36, 52].map(n => (
                    <button key={n} onClick={() => setGoalInput(n.toString())}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${ goalInput === n.toString() ? 'bg-primary text-white border-primary' : 'hover:bg-muted' }`}>
                      {n} books
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowGoalsModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={() => { setSavedGoal(parseInt(goalInput) || 50); setShowGoalsModal(false); }}>Save Goal</Button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
