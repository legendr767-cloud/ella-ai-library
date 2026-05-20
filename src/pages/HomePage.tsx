import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, TrendingUp, Sparkles, Search, Users, Award, BookOpen, Star, ArrowRight, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const featuredBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    rating: 4.5,
    category: 'Fiction',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    rating: 4.8,
    category: 'Fiction',
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    rating: 4.7,
    category: 'Sci-Fi',
  },
  {
    id: 4,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    rating: 4.3,
    category: 'Fiction',
  },
];

const categories = [
  { name: 'Fiction', count: 1250, icon: Book, gradient: 'from-purple-600 to-violet-800' },
  { name: 'Science', count: 890, icon: Sparkles, gradient: 'from-fuchsia-600 to-purple-800' },
  { name: 'Technology', count: 654, icon: TrendingUp, gradient: 'from-emerald-600 to-teal-800' },
  { name: 'History', count: 432, icon: BookOpen, gradient: 'from-amber-600 to-orange-800' },
];

const features = [
  { icon: Sparkles, title: 'AI Recommendations', description: 'Get personalized book suggestions powered by advanced AI tailored to your reading taste.', gradient: 'from-purple-500 to-fuchsia-500' },
  { icon: BookOpen, title: 'Online Reading', description: 'Read books directly in your browser with our built-in PDF/EPUB reader — anytime, anywhere.', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Award, title: 'Track Progress', description: 'Monitor your reading journey and earn badges for hitting your personal reading goals.', gradient: 'from-amber-500 to-orange-500' },
  { icon: Zap, title: 'Instant Access', description: 'Borrow and return books digitally with zero wait times. No late fees, no hassle.', gradient: 'from-sky-500 to-blue-500' },
  { icon: Shield, title: 'Secure & Private', description: 'Your reading history and personal data is always encrypted and kept private.', gradient: 'from-rose-500 to-pink-500' },
  { icon: Users, title: 'Community', description: 'Join a thriving community of readers. Share reviews and discover what others love.', gradient: 'from-violet-500 to-purple-500' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#05050f]">
        {/* Orb backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-purple-700/20 rounded-full blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-900/25 rounded-full blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-purple-900/10 rounded-full blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-sm font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Smart Library
              </motion.span>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
                Your Next
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
                  Favourite Book
                </span>
                <br />
                Awaits
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                Discover thousands of books with intelligent AI recommendations, seamless digital borrowing, and an immersive reading experience — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/books">
                  <Button size="lg" className="gap-2 px-8 shadow-xl shadow-primary/30">
                    <Search className="w-5 h-5" />
                    Browse Books
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 bg-transparent">
                    <Users className="w-5 h-5" />
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex items-center gap-8 pt-2 border-t border-white/5">
                {[{ value: '10K+', label: 'Books' }, { value: '5K+', label: 'Readers' }, { value: '4.8★', label: 'Rating' }].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Floating book covers */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 -z-10 bg-purple-600/10 blur-3xl rounded-3xl" />
              <div className="grid grid-cols-2 gap-4">
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + index * 0.1 }}
                    className={`rounded-2xl overflow-hidden border border-white/10 ${index % 2 === 0 ? 'mt-6' : ''}`}
                    style={{ boxShadow: '0 24px 64px rgba(139,92,246,0.18), 0 0 0 1px rgba(255,255,255,0.04)' }}
                  >
                    <img src={book.cover} alt={book.title} className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="p-3 bg-white/5 backdrop-blur border-t border-white/5">
                      <p className="text-white text-sm font-semibold truncate">{book.title}</p>
                      <p className="text-gray-500 text-xs">{book.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Featured Books ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Handpicked</p>
              <h2 className="text-4xl font-bold">Featured Books</h2>
            </div>
            <Link to="/books">
              <Button variant="outline" className="gap-2">View All <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10 group">
                  <div className="relative overflow-hidden">
                    <img src={book.cover} alt={book.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs font-medium">
                      {book.category}
                    </span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-base">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{book.rating}</span>
                      </div>
                      <Link to={`/books/${book.id}`}>
                        <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary hover:text-white hover:border-primary">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-4xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">Find books in your favourite genres</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/books?category=${cat.name}`}>
                  <Card className="hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer border-border/50 group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                        <cat.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.count.toLocaleString()} books</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Why Us</p>
            <h2 className="text-4xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">A complete reading ecosystem designed for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all h-full">
                  <CardHeader>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden bg-[#05050f]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-700/20 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Join thousands of readers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Start Your Reading Journey?</h2>
            <p className="text-gray-400 text-lg">Sign up free and discover your next favourite book today</p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link to="/register">
                <Button size="lg" className="gap-2 px-10 shadow-xl shadow-primary/30">
                  <Users className="w-5 h-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/books">
                <Button size="lg" variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 bg-transparent">
                  <Search className="w-5 h-5" />
                  Explore Books
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
