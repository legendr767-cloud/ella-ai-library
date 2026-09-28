import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, BadgeCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import { Book, Category } from '@/types';

const PAGE_SIZE = 12;

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookService.getBooks(
        { search: search || undefined, category_id: categoryId || undefined },
        page,
        PAGE_SIZE
      );
      setBooks(res.data);
      setTotalPages(Math.max(res.total_pages, 1));
      setTotal(res.total);
    } catch (e: any) {
      setError(e.message || 'Could not load books');
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">{total} book{total === 1 ? '' : 's'} in the library</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <select
            className="px-3 py-2 rounded-md border bg-background text-sm md:w-56"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          >
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : error ? (
          <p className="py-20 text-center text-red-500">{error}</p>
        ) : books.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <BookOpen className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p>No books found{search ? ` for “${search}”` : ''}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                  )}
                </div>
                <CardContent className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap gap-1">
                    {book.is_verified && <Badge className="gap-1"><BadgeCheck className="w-3 h-3" />Verified</Badge>}
                    {book.file_path && <Badge variant="outline">{book.file_type?.toUpperCase()}</Badge>}
                  </div>
                  <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <Link to={`/books/${book.id}`} className="mt-auto">
                    <Button className="w-full" size="sm">View & Read</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
