import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Instagram, Github, Mail } from 'lucide-react';
import { ROUTES } from '@/config/constants';

const socialIcons = [Twitter, Instagram, Github, Mail];

const navLinks = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.BOOKS, label: 'Browse Books' },
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.LOGIN, label: 'Sign In' },
];

const supportLinks = ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand — spans 2 cols */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/20 border border-primary/30">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl gradient-text">Ella's Library</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A modern AI-powered library for the digital age. Discover, borrow, and read thousands of books — all in one place.
            </p>
            <div className="flex gap-3 pt-1">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">Navigate</h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Ella's Library. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built with ❤️ for book lovers</p>
        </div>
      </div>
    </footer>
  );
}
