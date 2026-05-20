import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/common/ThemeToggle';
import { ROUTES } from '@/config/constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const navLinks = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.BOOKS, label: 'Browse Books' },
    ...(isAuthenticated ? [{ to: ROUTES.DASHBOARD, label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10 group-hover:bg-primary/30 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl gradient-text tracking-tight">Ella's Library</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to={ROUTES.PROFILE}>
                <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  My Account
                </Button>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm" className="shadow-lg shadow-primary/25">Sign Up</Button>
                </Link>
              </div>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2 px-2">
              <Link to={ROUTES.LOGIN} className="flex-1">
                <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>Login</Button>
              </Link>
              <Link to={ROUTES.REGISTER} className="flex-1">
                <Button className="w-full" onClick={() => setIsMenuOpen(false)}>Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
