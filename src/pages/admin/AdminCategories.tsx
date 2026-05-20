import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, X, Save, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface CategoryEntry {
  id: number;
  name: string;
  description: string;
  slug: string;
  bookCount: number;
  color: string;
}

const colorOptions = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-gray-500',
];

const initialCategories: CategoryEntry[] = [
  { id: 1, name: 'Fiction', description: 'Fictional literature and novels', slug: 'fiction', bookCount: 1250, color: 'bg-blue-500' },
  { id: 2, name: 'Non-Fiction', description: 'Factual and informative books', slug: 'non-fiction', bookCount: 890, color: 'bg-green-500' },
  { id: 3, name: 'Science', description: 'Scientific literature and research', slug: 'science', bookCount: 654, color: 'bg-purple-500' },
  { id: 4, name: 'Technology', description: 'Technology and computer science', slug: 'technology', bookCount: 432, color: 'bg-orange-500' },
  { id: 5, name: 'History', description: 'Historical books and biographies', slug: 'history', bookCount: 345, color: 'bg-red-500' },
  { id: 6, name: 'Philosophy', description: 'Philosophical works and essays', slug: 'philosophy', bookCount: 210, color: 'bg-yellow-500' },
  { id: 7, name: 'Arts', description: 'Art, music, and creative works', slug: 'arts', bookCount: 187, color: 'bg-pink-500' },
  { id: 8, name: 'Business', description: 'Business and economics', slug: 'business', bookCount: 320, color: 'bg-teal-500' },
  { id: 9, name: 'Self-Help', description: 'Personal development and motivation', slug: 'self-help', bookCount: 275, color: 'bg-indigo-500' },
  { id: 10, name: 'Children', description: 'Books for children and young adults', slug: 'children', bookCount: 412, color: 'bg-gray-500' },
];

const emptyForm = { name: '', description: '', slug: '', color: 'bg-blue-500' };

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryEntry[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => { setEditingCat(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (cat: CategoryEntry) => {
    setEditingCat(cat);
    setForm({ name: cat.name, description: cat.description, slug: cat.slug, color: cat.color });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
    if (editingCat) {
      setCategories(categories.map(c => c.id === editingCat.id ? { ...c, ...form, slug } : c));
    } else {
      setCategories([...categories, { id: Date.now(), ...form, slug, bookCount: 0 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Categories</h1>
          <p className="text-muted-foreground">Organise the library's book categories</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Total Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{categories.reduce((s, c) => s + c.bookCount, 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Books</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{Math.round(categories.reduce((s, c) => s + c.bookCount, 0) / categories.length)}</p>
            <p className="text-sm text-muted-foreground">Avg. Books/Category</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(cat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setDeleteConfirm(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{cat.bookCount.toLocaleString()}</span>
                    <span className="text-muted-foreground">books</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">/{cat.slug}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editingCat ? 'Edit Category' : 'Add Category'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Name *</label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Slug</label>
                    <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => setForm({ ...form, color })}
                          className={`w-8 h-8 rounded-full ${color} ${form.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button className="flex-1 gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    {editingCat ? 'Save Changes' : 'Add Category'}
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
              <h3 className="text-lg font-bold mb-2">Delete Category</h3>
              <p className="text-muted-foreground mb-6">Are you sure? Books in this category will be uncategorised.</p>
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
