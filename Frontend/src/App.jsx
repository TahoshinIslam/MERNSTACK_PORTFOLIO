import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Error from './pages/Error';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Service from './pages/Service';
import {
  AuthPage,
  Dashboard,
  BlogPage,
  SettingsPage
} from './pages/Dashboard';
import {
  PortfolioPage, ServicesPage, ExperiencePage, EducationPage,
  AdvantagesPage, TestimonialsPage, ContactsPage, CommentsPage
} from './pages/Dashboard/Sections';

const ROUTE_LABELS = {
  '/admin':              { title: 'Dashboard',        sub: 'Overview of all content'   },
  '/admin/portfolio':    { title: 'Portfolio',        sub: 'Manage your projects'      },
  '/admin/blog':         { title: 'Blog',             sub: 'Articles and posts'        },
  '/admin/services':     { title: 'Services',         sub: 'What you offer'            },
  '/admin/experience':   { title: 'Experience',       sub: 'Work history'              },
  '/admin/education':    { title: 'Education',        sub: 'Academic background'       },
  '/admin/advantages':   { title: 'Advantages',       sub: 'Skills and strengths'      },
  '/admin/testimonials': { title: 'Testimonials',     sub: 'Client feedback'           },
  '/admin/contacts':     { title: 'Contact Messages', sub: 'Inbox from visitors'       },
  '/admin/comments':     { title: 'Comments',         sub: 'Blog reader comments'      },
  '/admin/settings':     { title: 'Settings',         sub: 'Account and configuration' },
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--bg)' }}>
    <div className="spin" />
  </div>
);

// ─── Guard: redirect to /login if not authenticated ──────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

// ─── Guard: redirect to /admin if already logged in ──────────────────────────
// This ALSO fixes the race condition: navigate('/admin') fires in AuthPage,
// then even if ProtectedRoute bounces back to /login momentarily, this guard
// immediately redirects to /admin once the user state commits.
function RedirectIfLoggedIn({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user)    return <Navigate to="/admin" replace />;
  return children;
}

// ─── Admin Layout (sidebar + topbar) ─────────────────────────────────────────
function AdminLayout() {
  const location = useLocation();
  const meta = ROUTE_LABELS[location.pathname] || { title: 'CMS', sub: '' };

  return (
    <div className="app-layout">
      <Sidebar currentPath={location.pathname} />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2>{meta.title}</h2>
            <div className="topbar-sub">{meta.sub}</div>
          </div>
        </header>
        <div key={location.pathname} className="page-animate"
          style={{ flex: 1, padding: '36px 40px' }}>
          <Routes>
            <Route path="/"             element={<Dashboard />}        />
            <Route path="/portfolio"    element={<PortfolioPage />}    />
            <Route path="/blog"         element={<BlogPage />}         />
            <Route path="/services"     element={<ServicesPage />}     />
            <Route path="/experience"   element={<ExperiencePage />}   />
            <Route path="/education"    element={<EducationPage />}    />
            <Route path="/advantages"   element={<AdvantagesPage />}   />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contacts"     element={<ContactsPage />}     />
            <Route path="/comments"     element={<CommentsPage />}     />
            <Route path="/settings"     element={<SettingsPage />}     />
            <Route path="*"             element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>

              {/* 🌐 Public portfolio routes — pages manage their own MasterLayout */}
              <Route path="/"          element={<Home />}        />
              <Route path="/about"     element={<About />}       />
              <Route path="/portfolio" element={<Portfolio />}   />
              <Route path="/service"   element={<Service />}     />
              <Route path="/blog"      element={<Blog />}        />
              <Route path="/blog/:id"  element={<BlogDetails />} />
              <Route path="/contact"   element={<Contact />}     />

              {/* 🔑 Login — auto-redirects to /admin if already authenticated */}
              <Route path="/login" element={
                <RedirectIfLoggedIn>
                  <AuthPage />
                </RedirectIfLoggedIn>
              } />

              {/* 🔒 Protected admin — requires auth */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<Error />} />

            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
