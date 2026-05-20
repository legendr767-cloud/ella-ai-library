# 📚 AI-Powered Library Management System

A modern, production-grade cloud-based library management system with AI-powered book recommendations, built with React, TypeScript, Supabase, and TailwindCSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role system**: Admin, Librarian, and Student roles
- **Secure authentication** with Supabase Auth
- **Email verification** and password reset
- **Row-level security** (RLS) for data protection
- **JWT session management**

### 📖 Book Management
- **Complete CRUD operations** for books
- **Advanced search** with full-text search
- **Filter by** category, language, rating, status
- **Upload book covers** and digital files (PDF/EPUB)
- **ISBN validation** and duplicate detection
- **Inventory tracking** with real-time availability

### 📚 Borrowing System
- **Smart borrowing** with availability checks
- **Automatic due date** calculation
- **Fine calculation** for overdue books
- **Renewal system** (up to 2 renewals)
- **Borrow history** tracking
- **Reservation/waitlist** system
- **Email notifications** for due dates

### 🤖 AI Recommendation Engine
- **Collaborative filtering**: Based on similar users
- **Content-based filtering**: Based on book metadata
- **Hybrid recommendations**: Combined algorithms
- **Trending books** in user's favorite categories
- **"Because you read"** suggestions
- **Personalized homepage**

### 📱 Online Book Reader
- **In-browser PDF reader**
- **EPUB support**
- **Bookmarking system**
- **Reading progress tracking**
- **Continue reading** from last position
- **Dark mode** for comfortable reading
- **Font size adjustment**

### 📊 Admin Dashboard
- **Real-time analytics** and statistics
- **User management** with role assignment
- **Book inventory** management
- **Borrow tracking** and overdue monitoring
- **Category management**
- **Fine collection** tracking
- **Activity logs** and audit trails

### 🎯 Advanced Features
- **Real-time notifications**
- **Wishlist/Favorites** system
- **Book reviews** and ratings
- **Reading streaks** and gamification
- **Achievement badges**
- **Responsive design** (mobile-first)
- **Dark/Light mode**
- **Infinite scrolling**
- **Skeleton loaders**
- **Toast notifications**

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons
- **ShadCN UI** - Component library

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data protection
- **Supabase Auth** - Authentication
- **Supabase Storage** - File storage
- **Supabase Realtime** - Live updates

### Deployment
- **Vercel** - Frontend hosting
- **Supabase Cloud** - Backend hosting

## 📁 Project Structure

```
library/
├── database/
│   └── schema.sql              # Complete database schema
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── common/
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── navigation/
│   │   │   ├── AdminNavbar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── DashboardNavbar.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── config/
│   │   ├── constants.ts        # App constants
│   │   └── supabase.ts         # Supabase client
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdminBooks.tsx
│   │   │   ├── AdminBorrows.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── auth/
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── MyBooksPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── BookDetailsPage.tsx
│   │   ├── BooksPage.tsx
│   │   ├── HomePage.tsx
│   │   └── ReaderPage.tsx
│   ├── services/
│   │   ├── bookService.ts
│   │   ├── borrowService.ts
│   │   ├── categoryService.ts
│   │   ├── recommendationService.ts
│   │   └── reviewService.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── supabase.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key

4. **Set up the database**
   - Go to SQL Editor in Supabase Dashboard
   - Copy the contents of `database/schema.sql`
   - Run the SQL script

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. **Set up Supabase Storage**
   - Go to Storage in Supabase Dashboard
   - Create three buckets:
     - `book-covers` (public)
     - `book-files` (public)
     - `avatars` (public)

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=AI Library Management System
VITE_APP_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_SOCIAL_AUTH=true
VITE_ENABLE_AI_RECOMMENDATIONS=true

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=pdf,epub

# Borrowing Configuration
VITE_MAX_BORROW_LIMIT=5
VITE_DEFAULT_BORROW_DAYS=14
VITE_FINE_PER_DAY=0.50
```

### Supabase Configuration

1. **Enable Email Auth**
   - Go to Authentication > Providers
   - Enable Email provider

2. **Configure Email Templates**
   - Customize confirmation and password reset emails

3. **Set up Row Level Security**
   - The schema.sql file includes all RLS policies
   - Review and adjust as needed

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## 📖 Usage

### User Roles

1. **Admin**
   - Full system access
   - Manage users, books, categories
   - View analytics and reports
   - Configure system settings

2. **Librarian**
   - Manage books and inventory
   - Process borrow/return transactions
   - View reports

3. **Student**
   - Browse and search books
   - Borrow and return books
   - Write reviews
   - Track reading progress

### Key Workflows

#### Borrowing a Book
1. Browse or search for books
2. Click on a book to view details
3. Click "Borrow" button
4. Book is added to "My Books"
5. Due date is automatically calculated

#### Returning a Book
1. Go to "My Books"
2. Find the borrowed book
3. Click "Return" button
4. Fine is calculated if overdue

#### Admin: Adding a Book
1. Go to Admin > Books
2. Click "Add New Book"
3. Fill in book details
4. Upload cover image and book file
5. Save

## 🎨 Customization

### Theming

The app supports light and dark modes. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
    },
  },
}
```

### Constants

Modify app constants in `src/config/constants.ts`:
- Borrow limits
- Fine amounts
- Pagination sizes
- etc.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint
```

## 📝 API Documentation

### Book Service

```typescript
// Get all books with filters
bookService.getBooks(filters, page, limit)

// Get book by ID
bookService.getBookById(id)

// Create book
bookService.createBook(bookData)

// Update book
bookService.updateBook(id, updates)

// Delete book
bookService.deleteBook(id)
```

### Borrow Service

```typescript
// Borrow a book
borrowService.borrowBook(userId, bookId)

// Return a book
borrowService.returnBook(borrowId)

// Renew a book
borrowService.renewBook(borrowId)

// Get user's active borrows
borrowService.getUserActiveBorrows(userId)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [TailwindCSS](https://tailwindcss.com) - Styling
- [ShadCN UI](https://ui.shadcn.com) - Component library
- [Lucide](https://lucide.dev) - Icons
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📧 Support

For support, email support@example.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with external book APIs
- [ ] Multi-language support
- [ ] QR code scanning for books
- [ ] Advanced AI recommendations
- [ ] Social features (book clubs, discussions)
- [ ] Export reports (PDF, Excel)

---

**Built with ❤️ using React, TypeScript, and Supabase**
