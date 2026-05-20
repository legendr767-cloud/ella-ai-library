import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Sparkles, Users } from 'lucide-react';

const floatingBooks = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', rating: 4.5, gradient: 'from-purple-600 to-violet-800' },
  { title: '1984', author: 'George Orwell', rating: 4.7, gradient: 'from-fuchsia-600 to-purple-700' },
  { title: 'Dune', author: 'Frank Herbert', rating: 4.9, gradient: 'from-violet-600 to-purple-900' },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right — Cinematic branding */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden bg-[#05050f]">
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-700/25 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-violet-900/30 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center space-y-8 px-10 max-w-md w-full"
        >
          {/* Brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 shadow-xl shadow-primary/20">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
              Ella's Library
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Your Digital Reading Universe</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Access thousands of books, get AI-powered recommendations, and track your reading journey — all from one beautiful place.
            </p>
          </div>

          {/* Floating book cards */}
          <div className="space-y-3 text-left">
            {floatingBooks.map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${book.gradient} flex-shrink-0 shadow-lg`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{book.title}</p>
                  <p className="text-gray-500 text-xs">{book.author}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-semibold">{book.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-8 pt-2 border-t border-white/5">
            {[
              { icon: Users, value: '5,000+', label: 'Readers' },
              { icon: BookOpen, value: '10,000+', label: 'Books' },
              { icon: Sparkles, value: 'AI', label: 'Powered' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-gray-600 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
