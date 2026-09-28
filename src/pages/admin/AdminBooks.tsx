import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Trash2,
  BookOpen,
  X,
  Upload,
  Download,
  BadgeCheck,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import { Book, Category } from '@/types';
import { formatBytes, validateBookFile, validateCoverFile } from '@/utils/documents';

interface FormState {
  title: string;
  author: string;
  category_id: string;
  language: string;
  description: string;
}

const emptyForm: FormState = {
  title: '',
  author: '',
  category_id: '',
  language: 'en',
  description: '',
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'epub'>('pdf');
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [b, c] = await Promise.all([
        bookService.getBooks(search ? { search } : undefined, 1, 100),
        categoryService.getCategories(),
      ]);
      setBooks(b.data);
      setCategories(c);
    } catch (e: any) {
      toast.error(e.message || 'Could not load books');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const openAdd = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' });
    setFile(null);
    setCover(null);
    setShowModal(true);
  };

  const onPickFile = async (f: File | null) => {
    if (!f) return setFile(null);
    const result = await validateBookFile(f);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setFile(f);
    setFileType(result.type);
    // Pre-fill the title from the file name if empty
    if (!form.title) {
      setForm((prev) => ({ ...prev, title: f.name.replace(/\.(pdf|epub)$/i, '').replace(/[_-]+/g, ' ') }));
    }
  };

  const onPickCover = async (f: File | null) => {
    if (!f) return setCover(null);
    const err = await validateCoverFile(f);
    if (err) return toast.error(err);
    setCover(f);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Please enter a title.');
    if (!file) return toast.error('Choose the book file (PDF or EPUB) to upload.');

    setSaving(true);
    try {
      await bookService.createBookWithFiles(
        {
          title: form.title.trim(),
          author: form.author.trim() || null,
          category_id: form.category_id || undefined,
          language: form.language,
          description: form.description.trim(),
          quantity: 1,
          available_quantity: 1,
          status: 'available',
        },
        file,
        fileType,
        cover
      );
      toast.success('Book uploaded and published to the library.');
      setShowModal(false);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookService.deleteBook(deleteTarget.id);
      toast.success('Book and its files were deleted.');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (book: Book) => {
    try {
      const url = await bookService.getDownloadUrl(book);
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message || 'Download failed');
    }
  };

  const toggleVerified = async (book: Book) => {
    try {
      await bookService.setVerified(book.id, !book.is_verified);
      toast.success(book.is_verified ? 'Verification removed' : 'Marked as verified');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Could not update');
    }
  };

  const withFile = books.filter((b) => b.file_path).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Books</h1>
          <p className="text-muted-foreground">Upload, download and delete real book files</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Book
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: books.length },
          { label: 'With Digital File', value: withFile },
          { label: 'Verified', value: books.filter((b) => b.is_verified).length },
          { label: 'Downloads', value: books.reduce((s, b) => s + (b.download_count ?? 0), 0) },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Book Catalogue</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Title / Author</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">File</th>
                    <th className="pb-3 font-medium">Downloads</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {book.cover_image_url ? (
                            <img src={book.cover_image_url} alt="" className="w-8 h-11 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-11 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{book.title}</p>
                            {book.author && <p className="text-xs text-muted-foreground">{book.author}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-xs">{book.category?.name ?? '—'}</td>
                      <td className="py-3">
                        {book.file_path ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <FileText className="w-3 h-3" />
                            {book.file_type?.toUpperCase()} · {formatBytes(book.file_size_bytes)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No file</span>
                        )}
                      </td>
                      <td className="py-3">{book.download_count ?? 0}</td>
                      <td className="py-3">
                        {book.is_verified ? (
                          <Badge className="gap-1"><BadgeCheck className="w-3 h-3" />Verified</Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Toggle verified" className="h-8 w-8 p-0" onClick={() => toggleVerified(book)}>
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Download" className="h-8 w-8 p-0" disabled={!book.file_path} onClick={() => handleDownload(book)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Delete" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => setDeleteTarget(book)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {books.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No books yet. Click “Upload Book” to add your first real book.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => !saving && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Upload New Book</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} disabled={saving} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Book file (PDF or EPUB) *</label>
                  <label className="flex items-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{file ? `${file.name} · ${formatBytes(file.size)}` : 'Click to choose a file'}</span>
                    <input type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Cover image (optional)</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => onPickCover(e.target.files?.[0] ?? null)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium">Title *</label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium">Author <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full px-3 py-2 rounded-md border bg-background text-sm" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                      <option value="">— None —</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Language</label>
                    <select className="w-full px-3 py-2 rounded-md border bg-background text-sm" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="pt">Portuguese</option>
                      <option value="de">German</option>
                      <option value="ar">Arabic</option>
                      <option value="yo">Yoruba</option>
                      <option value="ig">Igbo</option>
                      <option value="ha">Hausa</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <textarea rows={3} className="w-full px-3 py-2 rounded-md border bg-background text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  The file is checked, fingerprinted (SHA-256) and stored privately. Only signed-in members can read or download it.
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
                  <Button className="flex-1 gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {saving ? 'Uploading…' : 'Upload & Publish'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => !deleting && setDeleteTarget(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background rounded-lg shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Delete “{deleteTarget.title}”?</h3>
              <p className="text-muted-foreground mb-6">The book record and its uploaded file are permanently removed. This cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
                <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
