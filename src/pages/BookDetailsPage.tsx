import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Download,
  BadgeCheck,
  ShieldAlert,
  FileText,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { bookService } from '@/services/bookService';
import { useAuthStore } from '@/store/authStore';
import { formatBytes } from '@/utils/documents';
import { Book } from '@/types';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookService
      .getBookById(id)
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    if (!book) return;
    setDownloading(true);
    try {
      const url = await bookService.getDownloadUrl(book);
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="py-32 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }
  if (!book) {
    return (
      <div className="py-32 text-center">
        <p className="mb-4">This book could not be found.</p>
        <Link to="/books"><Button variant="outline">Back to books</Button></Link>
      </div>
    );
  }

  const hasFile = !!book.file_path;
  const rows: [string, string | number | null | undefined][] = [
    ['Language', book.language?.toUpperCase()],
    ['Pages', book.pages],
    ['Category', book.category?.name],
    ['File', hasFile ? `${book.file_type?.toUpperCase()} · ${formatBytes(book.file_size_bytes)}` : 'No digital file'],
    ['Added', new Date(book.created_at).toLocaleDateString()],
    ['Downloads', book.download_count ?? 0],
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" size="sm" className="gap-1 mb-6" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          <div>
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted flex items-center justify-center shadow">
              {book.cover_image_url ? (
                <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-16 h-16 text-muted-foreground/40" />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {book.category && <Badge>{book.category.name}</Badge>}
                {book.is_verified ? (
                  <Badge className="gap-1"><BadgeCheck className="w-3 h-3" />Verified genuine</Badge>
                ) : (
                  <Badge variant="outline" className="gap-1"><ShieldAlert className="w-3 h-3" />Awaiting verification</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-1">{book.title}</h1>
              {book.author && <p className="text-xl text-muted-foreground">by {book.author}</p>}
            </div>

            {/* Read / Download */}
            <div className="flex flex-wrap gap-3">
              {!hasFile ? (
                <p className="text-sm text-muted-foreground">A digital copy of this book has not been uploaded yet.</p>
              ) : isAuthenticated ? (
                <>
                  <Link to={`/reader/${book.id}`}>
                    <Button size="lg" className="gap-2"><BookOpen className="w-4 h-4" />Read Online</Button>
                  </Link>
                  <Button size="lg" variant="outline" className="gap-2" onClick={handleDownload} disabled={downloading}>
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download {book.file_type?.toUpperCase()}
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="lg">Sign in to read or download</Button>
                </Link>
              )}
            </div>

            {book.description && (
              <div>
                <h2 className="font-semibold mb-2">About this book</h2>
                <p className="text-muted-foreground whitespace-pre-line">{book.description}</p>
              </div>
            )}

            <Card>
              <CardHeader><CardTitle className="text-base">Book details</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {rows.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" /> Authenticity check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  {book.is_verified
                    ? `A librarian confirmed this is a genuine copy${book.verified_at ? ` on ${new Date(book.verified_at).toLocaleDateString()}` : ''}.`
                    : 'This book has not yet been confirmed by a librarian.'}
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Uploaded by the library team, not by members.</li>
                  {hasFile && <li>• File type was checked on upload ({book.file_type?.toUpperCase()}).</li>}
                  {hasFile && <li className="flex items-start gap-1"><FileText className="w-4 h-4 mt-0.5 shrink-0" /><span>File fingerprint (SHA-256): <code className="break-all text-xs">{book.file_sha256}</code></span></li>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
