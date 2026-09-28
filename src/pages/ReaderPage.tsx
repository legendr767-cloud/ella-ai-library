import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  BookOpen,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { bookService } from '@/services/bookService';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/store/authStore';
import { Book } from '@/types';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type ReaderTheme = 'light' | 'sepia' | 'dark';

const themeClasses: Record<ReaderTheme, string> = {
  light: 'bg-gray-100',
  sepia: 'bg-[#f4ecd8]',
  dark: 'bg-gray-900',
};

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [book, setBook] = useState<Book | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [width, setWidth] = useState(800);
  const [startPage, setStartPage] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Load book, signed URL, saved progress and bookmarks
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const b = await bookService.getBookById(id);
        if (!b.file_path) throw new Error('This book has no digital file yet.');
        const signed = await bookService.getReadUrl(b);
        if (cancelled) return;
        setBook(b);
        setUrl(signed);

        if (user) {
          const [{ data: prog }, { data: marks }] = await Promise.all([
            supabase.from('reading_progress').select('current_page').eq('user_id', user.id).eq('book_id', id).maybeSingle(),
            supabase.from('bookmarks').select('page_number').eq('user_id', user.id).eq('book_id', id),
          ]);
          if (cancelled) return;
          if (prog?.current_page && prog.current_page > 0) {
            setStartPage(prog.current_page);
            setPageNumber(prog.current_page);
          }
          setBookmarks((marks ?? []).map((m: any) => m.page_number));
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Could not open this book.');
      }
    })();
    return () => { cancelled = true; };
  }, [id, user]);

  // Keep page width in sync with the window
  useEffect(() => {
    const update = () => setWidth(Math.min(wrapRef.current?.clientWidth ?? 800, 1000) - 32);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [book]);

  // Save reading progress (debounced)
  useEffect(() => {
    if (!user || !id || !numPages) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase.from('reading_progress').upsert(
        {
          user_id: user.id,
          book_id: id,
          current_page: pageNumber,
          total_pages: numPages,
          progress_percentage: Math.round((pageNumber / numPages) * 10000) / 100,
          is_completed: pageNumber >= numPages,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,book_id' }
      );
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [pageNumber, numPages, user, id]);

  const go = useCallback(
    (delta: number) => setPageNumber((p) => Math.min(Math.max(p + delta, 1), numPages || 1)),
    [numPages]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const toggleBookmark = async () => {
    if (!user || !id) return;
    const has = bookmarks.includes(pageNumber);
    if (has) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('book_id', id).eq('page_number', pageNumber);
      setBookmarks(bookmarks.filter((p) => p !== pageNumber));
    } else {
      const { error: err } = await supabase.from('bookmarks').insert({ user_id: user.id, book_id: id, page_number: pageNumber });
      if (err) return toast.error('Could not save bookmark');
      setBookmarks([...bookmarks, pageNumber].sort((a, b) => a - b));
    }
  };

  const download = async () => {
    if (!book) return;
    try {
      window.location.href = await bookService.getDownloadUrl(book);
    } catch (e: any) {
      toast.error(e.message || 'Download failed');
    }
  };

  const isPdf = book?.file_type !== 'epub';

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-background z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold truncate">{book?.title ?? 'Loading…'}</h1>
              <p className="text-xs text-muted-foreground truncate">{book?.author}</p>
            </div>
          </div>

          {isPdf && url && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}><ZoomOut className="w-4 h-4" /></Button>
              <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}><ZoomIn className="w-4 h-4" /></Button>
              <div className="hidden md:flex border rounded-lg p-1 mx-2 gap-1">
                <Button variant={theme === 'light' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('light')}><Sun className="w-4 h-4" /></Button>
                <Button variant={theme === 'sepia' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('sepia')}><BookOpen className="w-4 h-4" /></Button>
                <Button variant={theme === 'dark' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('dark')}><Moon className="w-4 h-4" /></Button>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleBookmark} title="Bookmark this page">
                {bookmarks.includes(pageNumber) ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={download} title="Download"><Download className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div ref={wrapRef} className={`flex-1 overflow-auto ${themeClasses[theme]} transition-colors`}>
        {error ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <p className="mb-4 text-red-500">{error}</p>
              <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
            </div>
          </div>
        ) : !url || !book ? (
          <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !isPdf ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div className="max-w-sm">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="mb-4">EPUB files can’t be previewed in the browser yet. Download it to read in your e-reader app.</p>
              <Button onClick={download} className="gap-2"><Download className="w-4 h-4" />Download EPUB</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className={theme === 'dark' ? 'invert hue-rotate-180' : theme === 'sepia' ? 'sepia' : ''}>
              <Document
                file={url}
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n);
                  setPageNumber(Math.min(startPage, n));
                }}
                onLoadError={() => setError('The file could not be loaded.')}
                loading={<Loader2 className="w-8 h-8 animate-spin mx-auto my-20 text-muted-foreground" />}
              >
                <Page pageNumber={pageNumber} width={width * zoom} className="shadow-lg" />
              </Document>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      {isPdf && url && numPages > 0 && !error && (
        <div className="border-t bg-background py-2">
          <div className="container mx-auto px-4 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={pageNumber <= 1}><ChevronLeft className="w-4 h-4" /></Button>
            <div className="flex items-center gap-2 text-sm">
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.min(Math.max(Number(e.target.value) || 1, 1), numPages))}
                className="w-16 px-2 py-1 rounded border bg-background text-center"
              />
              <span className="text-muted-foreground">of {numPages}</span>
              <span className="text-muted-foreground hidden sm:inline">· {Math.round((pageNumber / numPages) * 100)}%</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => go(1)} disabled={pageNumber >= numPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
