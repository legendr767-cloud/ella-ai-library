import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, BookOpen, Heart, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Mock book data
const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    rating: 4.5,
    category: 'Fiction',
    year: 1925,
    available: true,
    description: 'A classic American novel set in the Jazz Age',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    rating: 4.8,
    category: 'Fiction',
    year: 1960,
    available: true,
    description: 'A gripping tale of racial injustice and childhood innocence',
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    rating: 4.7,
    category: 'Science Fiction',
    year: 1949,
    available: false,
    description: 'A dystopian social science fiction novel',
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    rating: 4.6,
    category: 'Romance',
    year: 1813,
    available: true,
    description: 'A romantic novel of manners',
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    rating: 4.7,
    category: 'Fantasy',
    year: 1937,
    available: true,
    description: 'A fantasy adventure novel',
  },
  {
    id: 6,
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&h=600&fit=crop',
    rating: 4.9,
    category: 'Fantasy',
    year: 1997,
    available: true,
    description: 'The magical journey of a young wizard',
  },
  {
    id: 7,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    rating: 4.3,
    category: 'Fiction',
    year: 1951,
    available: false,
    description: 'A story about teenage rebellion',
  },
  {
    id: 8,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop',
    rating: 4.4,
    category: 'Science Fiction',
    year: 1932,
    available: true,
    description: 'A dystopian novel about a futuristic society',
  },
];

const categories = ['All', 'Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Non-Fiction'];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [borrowedIds, setBorrowedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFavorite = (id: number, title: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    showToast(favorites.includes(id) ? `Removed from favourites` : `Added "${title}" to favourites`, 'info');
  };

  const handleBorrow = (id: number, title: string) => {
    setBorrowedIds(prev => [...prev, id]);
    showToast(`"${title}" borrowed! Check My Books for details.`);
  };

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Discover your next favorite read from our collection</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant={book.available ? 'default' : 'secondary'}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </Badge>
                  </div>
                  <button onClick={() => toggleFavorite(book.id, book.title)} className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                    <Heart className={`w-4 h-4 transition-colors ${favorites.includes(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
                
                <CardHeader className="flex-1">
                  <Badge variant="outline" className="w-fit mb-2">{book.category}</Badge>
                  <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {book.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{book.rating}</span>
                      <span className="text-sm text-muted-foreground">({book.year})</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/books/${book.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-2">
                        <BookOpen className="w-4 h-4" />
                        Details
                      </Button>
                    </Link>
                    {book.available && !borrowedIds.includes(book.id) ? (
                      <Button size="sm" className="flex-1" onClick={() => handleBorrow(book.id, book.title)}>
                        Borrow
                      </Button>
                    ) : borrowedIds.includes(book.id) ? (
                      <Button size="sm" variant="secondary" className="flex-1" disabled>
                        <CheckCircle className="w-3 h-3 mr-1" />Borrowed
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" className="flex-1" disabled>
                        Unavailable
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white ${ toast.type === 'success' ? 'bg-green-600' : 'bg-primary' }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{toast.msg}</span>
            <button onClick={() => setToast(null)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
          </motion.div>
        )}
      </AnimatePresence>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
