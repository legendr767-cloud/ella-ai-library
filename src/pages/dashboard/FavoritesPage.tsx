import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  BookmarkPlus,
  List,
  Plus,
  Star,
  Trash2,
  Share2,
  Eye,
  CheckCircle,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type ListType = 'favorites' | 'wishlist' | 'currently-reading' | 'finished' | 'custom';

const lists = [
  { id: 'favorites', name: 'Favorites', icon: Heart, count: 12, color: 'text-red-500' },
  { id: 'wishlist', name: 'Want to Read', icon: BookmarkPlus, count: 8, color: 'text-purple-500' },
  { id: 'currently-reading', name: 'Currently Reading', icon: List, count: 3, color: 'text-green-500' },
  { id: 'finished', name: 'Finished', icon: Star, count: 24, color: 'text-purple-500' },
];

const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    rating: 4.5,
    category: 'Fiction',
    addedDate: '2 days ago',
    lists: ['favorites', 'finished'],
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    rating: 4.7,
    category: 'Sci-Fi',
    addedDate: '5 days ago',
    lists: ['wishlist'],
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    rating: 4.8,
    category: 'Fiction',
    addedDate: '1 week ago',
    lists: ['favorites', 'currently-reading'],
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.6,
    category: 'Romance',
    addedDate: '2 weeks ago',
    lists: ['favorites', 'wishlist'],
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop',
    rating: 4.9,
    category: 'Fantasy',
    addedDate: '3 weeks ago',
    lists: ['favorites'],
  },
  {
    id: 6,
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop',
    rating: 4.9,
    category: 'Fantasy',
    addedDate: '1 month ago',
    lists: ['finished'],
  },
];

export default function FavoritesPage() {
  const [activeList, setActiveList] = useState<string>('favorites');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [books, setBooks] = useState(mockBooks);
  const [customLists, setCustomLists] = useState<{id: string; name: string; icon: typeof Heart; count: number; color: string}[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleRemove = (bookId: number, listId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, lists: b.lists.filter(l => l !== listId) } : b));
    showToast('Book removed from list.');
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    const id = newListName.toLowerCase().replace(/\s+/g, '-');
    setCustomLists(prev => [...prev, { id, name: newListName, icon: List, count: 0, color: 'text-primary' }]);
    setNewListName('');
    setShowCreateModal(false);
    showToast(`List "${newListName}" created!`);
  };

  const allLists = [...lists, ...customLists];

  const filteredBooks = books.filter(book => book.lists.includes(activeList));
  const activeListData = allLists.find(l => l.id === activeList);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Lists</h1>
          <p className="text-muted-foreground">Organize and manage your reading collection</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create List
        </Button>
      </div>

      {/* List Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {allLists.map((list) => {
          const Icon = list.icon;
          return (
            <button
              key={list.id}
              onClick={() => setActiveList(list.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all whitespace-nowrap ${
                activeList === list.id
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-muted'
              }`}
            >
              <Icon className={`w-5 h-5 ${list.color}`} />
              <div className="text-left">
                <div className="font-semibold">{list.name}</div>
                <div className="text-sm text-muted-foreground">{list.count} books</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* List Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeListData && (
                <>
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                    <activeListData.icon className={`w-6 h-6 ${activeListData.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{activeListData.name}</h2>
                    <p className="text-muted-foreground">{filteredBooks.length} books in this list</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid/List */}
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <List className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No books in this list</h3>
            <p className="text-muted-foreground mb-4">Start adding books to organize your reading</p>
            <Link to="/books">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Browse Books
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link to={`/books/${book.id}`}>
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </Link>
                      <Button size="sm" variant="secondary" className="gap-1" onClick={() => handleRemove(book.id, activeList)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{book.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{book.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Added {book.addedDate}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/books/${book.id}`}>
                            <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                              {book.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground">{book.author}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{book.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{book.category}</Badge>
                        {book.lists.map((list) => (
                          <Badge key={list} variant="secondary" className="text-xs">
                            {lists.find(l => l.id === list)?.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/books/${book.id}`}>
                          <Button size="sm" variant="default" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="gap-2"
                          onClick={() => showToast('Download starting...')}>
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-2 text-red-500 hover:text-red-600" onClick={() => handleRemove(book.id, activeList)}>
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Added {book.addedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-primary text-white">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{toast}</span>
            <button onClick={() => setToast(null)}><X className="w-4 h-4 opacity-70" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create List Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background rounded-xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Create New List</h2>
                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <input
                type="text" placeholder="List name..."
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateList()}
                className="w-full px-3 py-2 rounded-lg border bg-background mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm">Cancel</button>
                <button onClick={handleCreateList} className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium">Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List Stats */}
      {filteredBooks.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{filteredBooks.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {(filteredBooks.reduce((sum, book) => sum + book.rating, 0) / filteredBooks.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {new Set(filteredBooks.map(b => b.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {new Set(filteredBooks.map(b => b.author)).size}
                </p>
                <p className="text-sm text-muted-foreground">Authors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
