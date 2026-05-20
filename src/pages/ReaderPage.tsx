import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  Highlighter,
  MessageSquare,
  Settings,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Type,
  X,
  Menu,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const mockBook = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  currentPage: 45,
  totalPages: 180,
  progress: 25,
};

const mockBookmarks = [
  { page: 12, note: 'Important quote about dreams' },
  { page: 34, note: 'Character introduction' },
  { page: 45, note: 'Current position' },
];

const mockHighlights = [
  { page: 15, text: 'So we beat on, boats against the current...', color: 'yellow' },
  { page: 28, text: 'Gatsby believed in the green light...', color: 'green' },
];

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(mockBook.currentPage);
  const [fontSize, setFontSize] = useState(16);
  const [readerTheme, setReaderTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'highlights' | 'notes'>('bookmarks');

  const nextPage = () => {
    if (currentPage < mockBook.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const themeColors = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    sepia: 'bg-[#f4ecd8] text-[#5c4a3a]',
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold">{mockBook.title}</h1>
                <p className="text-xs text-muted-foreground">{mockBook.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Font Size Controls */}
              <div className="hidden md:flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                >
                  <Type className="w-4 h-4" />
                  <span className="text-xs ml-1">-</span>
                </Button>
                <span className="text-xs px-2">{fontSize}px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                >
                  <Type className="w-5 h-5" />
                  <span className="text-xs ml-1">+</span>
                </Button>
              </div>

              {/* Theme Toggle */}
              <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={readerTheme === 'light' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setReaderTheme('light')}
                >
                  <Sun className="w-4 h-4" />
                </Button>
                <Button
                  variant={readerTheme === 'sepia' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setReaderTheme('sepia')}
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
                <Button
                  variant={readerTheme === 'dark' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setReaderTheme('dark')}
                >
                  <Moon className="w-4 h-4" />
                </Button>
              </div>

              {/* Tools */}
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Highlighter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Page {currentPage} of {mockBook.totalPages}</span>
              <span>{Math.round((currentPage / mockBook.totalPages) * 100)}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / mockBook.totalPages) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Reader Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`${themeColors[readerTheme]} rounded-lg p-8 md:p-12 shadow-lg min-h-[600px]`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Chapter {Math.ceil(currentPage / 10)}</h2>
              
              <div className="space-y-4">
                <p>
                  In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.
                </p>
                <p>
                  "Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."
                </p>
                <p>
                  He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.
                </p>
                <p className="bg-yellow-200/30 px-2 py-1 rounded">
                  In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.
                </p>
                <p>
                  The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.
                </p>
                <p>
                  Most of the confidences were unsought—frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon.
                </p>
                <p>
                  The young privileged have always been with us, but in my generation they were more numerous than ever before.
                </p>
              </div>

              {/* Page Number */}
              <div className="mt-12 text-center text-sm opacity-50">
                {currentPage}
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {mockBook.totalPages}
              </div>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage >= mockBook.totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="w-80 border-l bg-background overflow-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Reading Tools</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {(['bookmarks', 'highlights', 'notes'] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant={sidebarTab === tab ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSidebarTab(tab)}
                    className="flex-1 capitalize"
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Content */}
              <div className="space-y-3">
                {sidebarTab === 'bookmarks' && (
                  <>
                    {mockBookmarks.map((bookmark, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Bookmark className="w-4 h-4 mt-1 text-primary" />
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1">Page {bookmark.page}</div>
                              <p className="text-xs text-muted-foreground">{bookmark.note}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}

                {sidebarTab === 'highlights' && (
                  <>
                    {mockHighlights.map((highlight, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Highlighter className="w-4 h-4 mt-1 text-yellow-500" />
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1">Page {highlight.page}</div>
                              <p className="text-xs italic">"{highlight.text}"</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {highlight.color}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}

                {sidebarTab === 'notes' && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No notes yet</p>
                      <Button size="sm" className="mt-3">Add Note</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
