import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Star, TrendingUp, Award, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const mockHistory = [
  {
    id: 1,
    book: {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
      category: 'Fiction',
    },
    completedDate: '2026-04-15',
    rating: 5,
    review: 'A masterpiece! The prose is beautiful.',
    readingTime: '8 hours',
  },
  {
    id: 2,
    book: {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
      category: 'Fiction',
    },
    completedDate: '2026-03-28',
    rating: 5,
    review: 'Powerful and moving story.',
    readingTime: '10 hours',
  },
  {
    id: 3,
    book: {
      id: 3,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
      category: 'Romance',
    },
    completedDate: '2026-03-10',
    rating: 4,
    review: 'Witty and charming.',
    readingTime: '12 hours',
  },
];

export default function HistoryPage() {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const sortedHistory = [...mockHistory].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
    }
    return b.rating - a.rating;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reading History</h1>
        <p className="text-muted-foreground">Your completed books and reading journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Books Read</p>
                <p className="text-3xl font-bold">{mockHistory.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Rating</p>
                <p className="text-3xl font-bold">
                  {(mockHistory.reduce((sum, h) => sum + h.rating, 0) / mockHistory.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                <p className="text-3xl font-bold">48</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Most Recent
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            Highest Rated
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter by Genre
        </Button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {sortedHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={item.book.cover}
                    alt={item.book.title}
                    className="w-20 h-30 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/books/${item.book.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground">{item.book.author}</p>
                      </div>
                      <Badge variant="outline">{item.book.category}</Badge>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{item.rating}.0</span>
                    </div>

                    {/* Review */}
                    {item.review && (
                      <p className="text-sm text-muted-foreground mb-3 italic">
                        "{item.review}"
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Completed {new Date(item.completedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {item.readingTime}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
