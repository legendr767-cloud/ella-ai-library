import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  BookOpen,
  Download,
  Clock,
  Users,
  Award,
  MessageSquare,
  ChevronRight,
  Play,
  Bookmark,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Mock book data (replace with API call later)
const mockBook = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=900&fit=crop',
  rating: 4.5,
  totalRatings: 2847,
  category: 'Fiction',
  year: 1925,
  pages: 180,
  language: 'English',
  isbn: '978-0-7432-7356-5',
  publisher: 'Scribner',
  available: true,
  totalCopies: 5,
  availableCopies: 3,
  description: `The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.

The novel was inspired by a youthful romance Fitzgerald had with socialite Ginevra King, and the riotous parties he attended on Long Island's North Shore in 1922. Following a move to the French Riviera, Fitzgerald completed a rough draft of the novel in 1924.`,
  tags: ['Classic', 'Romance', 'American Literature', 'Jazz Age'],
  audiobook: true,
  ebook: true,
  physical: true,
};

const mockReviews = [
  {
    id: 1,
    user: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    date: '2 days ago',
    comment: 'A timeless masterpiece! The prose is beautiful and the story is captivating.',
    helpful: 24,
  },
  {
    id: 2,
    user: 'Mike Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    rating: 4,
    date: '1 week ago',
    comment: 'Great read, though the pacing can be slow at times. Still highly recommended!',
    helpful: 12,
  },
  {
    id: 3,
    user: 'Emma Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 5,
    date: '2 weeks ago',
    comment: 'One of my all-time favorites. The symbolism and themes are incredible.',
    helpful: 18,
  },
];

const relatedBooks = [
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    rating: 4.8,
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.6,
  },
];

export default function BookDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'details'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/books" className="hover:text-primary">Books</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{mockBook.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Book Cover & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="relative group mb-6">
                  <img
                    src={mockBook.cover}
                    alt={mockBook.title}
                    className="w-full rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Play className="w-4 h-4" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full gap-2" size="lg">
                    <BookOpen className="w-5 h-5" />
                    Borrow Now
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Play className="w-4 h-4" />
                      Audio
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="gap-1"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Bookmark className="w-4 h-4" />
                      List
                    </Button>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Availability</span>
                    <Badge variant={mockBook.available ? 'default' : 'secondary'}>
                      {mockBook.available ? 'Available' : 'Borrowed'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mockBook.availableCopies} of {mockBook.totalCopies} copies available
                  </div>
                </div>

                {/* Formats */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Available Formats:</div>
                  <div className="flex flex-wrap gap-2">
                    {mockBook.physical && <Badge variant="outline">Physical</Badge>}
                    {mockBook.ebook && <Badge variant="outline">E-Book</Badge>}
                    {mockBook.audiobook && <Badge variant="outline">Audiobook</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Book Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge>{mockBook.category}</Badge>
                  {mockBook.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl font-bold mb-2">{mockBook.title}</h1>
                <p className="text-xl text-muted-foreground mb-4">by {mockBook.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(mockBook.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{mockBook.rating}</span>
                    <span className="text-muted-foreground">
                      ({mockBook.totalRatings.toLocaleString()} ratings)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mockBook.pages} pages
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mockBook.totalRatings} readers
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex gap-6">
                  {(['overview', 'reviews', 'details'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-1 capitalize font-medium transition-colors relative ${
                        activeTab === tab
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About this book</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {mockBook.description}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="font-semibold">Classic</div>
                        <div className="text-xs text-muted-foreground">Status</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
                        <div className="font-semibold">{mockBook.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="font-semibold">{mockBook.totalRatings}</div>
                        <div className="text-xs text-muted-foreground">Readers</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="font-semibold">{mockBook.pages}</div>
                        <div className="text-xs text-muted-foreground">Pages</div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Reader Reviews</h3>
                    <Button size="sm" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Write Review
                    </Button>
                  </div>

                  {mockReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold">{review.user}</div>
                                <div className="text-sm text-muted-foreground">{review.date}</div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment}</p>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Book Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">ISBN</div>
                          <div className="font-medium">{mockBook.isbn}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Publisher</div>
                          <div className="font-medium">{mockBook.publisher}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Year</div>
                          <div className="font-medium">{mockBook.year}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Language</div>
                          <div className="font-medium">{mockBook.language}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Pages</div>
                          <div className="font-medium">{mockBook.pages}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Category</div>
                          <div className="font-medium">{mockBook.category}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Related Books */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {relatedBooks.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{book.rating}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
