import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Star,
  X,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BookEntry {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  year: number;
  quantity: number;
  available: number;
  rating: number;
  status: string;
}

const initialBooks: BookEntry[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', year: 1925, quantity: 5, available: 3, rating: 4.5, status: 'available' },
  { id: 2, title: '1984', author: 'George Orwell', isbn: '9780451524935', category: 'Science Fiction', year: 1949, quantity: 4, available: 0, rating: 4.7, status: 'borrowed' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061935466', category: 'Fiction', year: 1960, quantity: 6, available: 4, rating: 4.8, status: 'available' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', category: 'Romance', year: 1813, quantity: 3, available: 2, rating: 4.6, status: 'available' },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', category: 'Fantasy', year: 1937, quantity: 4, available: 1, rating: 4.8, status: 'available' },
  { id: 6, title: 'Harry Potter', author: 'J.K. Rowling', isbn: '9780439708180', category: 'Fantasy', year: 1997, quantity: 8, available: 5, rating: 4.9, status: 'available' },
  { id: 7, title: 'Brave New World', author: 'Aldous Huxley', isbn: '9780060850524', category: 'Science Fiction', year: 1932, quantity: 2, available: 2, rating: 4.4, status: 'available' },
  { id: 8, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769174', category: 'Fiction', year: 1951, quantity: 3, available: 0, rating: 4.3, status: 'borrowed' },
];

const emptyForm: Omit<BookEntry, 'id'> = {
  title: '', author: '', isbn: '', category: 'Fiction', year: 2024,
  quantity: 1, available: 1, rating: 0, status: 'available',
};

const categories = ['Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Non-Fiction', 'History', 'Science', 'Technology', 'Philosophy', 'Business'];

export default function AdminBooks() {
  const [books, setBooks] = useState<BookEntry[]>(initialBooks);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<BookEntry | null>(null);
  const [form, setForm] = useState<Omit<BookEntry, 'id'>>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.includes(search)
  );

  const openAdd = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (book: BookEntry) => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, year: book.year, quantity: book.quantity, available: book.available, rating: book.rating, status: book.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.author) return;
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...form, id: editingBook.id } : b));
    } else {
      setBooks([...books, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter(b => b.id !== id));
    setDeleteConfirm(null);
  };

  const statusColor: Record<string, string> = {
    available: 'default',
    borrowed: 'secondary',
    maintenance: 'destructive',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Books</h1>
          <p className="text-muted-foreground">Add, edit, and manage the library book catalogue</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Book
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: books.length },
          { label: 'Available', value: books.filter(b => b.status === 'available').length },
          { label: 'Borrowed', value: books.filter(b => b.status === 'borrowed').length },
          { label: 'Total Copies', value: books.reduce((s, b) => s + b.quantity, 0) },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Book Catalogue</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Title / Author</th>
                  <th className="pb-3 font-medium">ISBN</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Year</th>
                  <th className="pb-3 font-medium">Copies</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, index) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-xs">{book.isbn}</td>
                    <td className="py-3"><Badge variant="outline">{book.category}</Badge></td>
                    <td className="py-3">{book.year}</td>
                    <td className="py-3">{book.available}/{book.quantity}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={(statusColor[book.status] || 'outline') as any} className="capitalize">
                        {book.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(book)} className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => setDeleteConfirm(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No books found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-sm font-medium">Title *</label>
                      <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Book title" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-sm font-medium">Author *</label>
                      <Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">ISBN</label>
                      <Input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} placeholder="978..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Published Year</label>
                      <Input type="number" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full px-3 py-2 rounded-md border bg-background text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Status</label>
                      <select className="w-full px-3 py-2 rounded-md border bg-background text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="available">Available</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Total Copies</label>
                      <Input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Available Copies</label>
                      <Input type="number" min="0" value={form.available} onChange={e => setForm({ ...form, available: Number(e.target.value) })} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button className="flex-1 gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    {editingBook ? 'Save Changes' : 'Add Book'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background rounded-lg shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Delete Book</h3>
              <p className="text-muted-foreground mb-6">Are you sure you want to delete this book? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
