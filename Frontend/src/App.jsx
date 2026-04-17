import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
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
  '/':            { title: 'Dashboard',         sub: 'Overview of all content' },
  '/portfolio':   { title: 'Portfolio',         sub: 'Manage your projects'     },
  '/blog':        { title: 'Blog',              sub: 'Articles and posts'       },
  '/services':    { title: 'Services',          sub: 'What you offer'           },
  '/experience':  { title: 'Experience',        sub: 'Work history'             },
  '/education':   { title: 'Education',         sub: 'Academic background'      },
  '/advantages':  { title: 'Advantages',        sub: 'Skills and strengths'     },
  '/testimonials':{ title: 'Testimonials',      sub: 'Client feedback'          },
  '/contacts':    { title: 'Contact Messages',  sub: 'Inbox from visitors'      },
  '/comments':    { title: 'Comments',          sub: 'Blog reader comments'     },
  '/settings':    { title: 'Settings',          sub: 'Account and configuration'},
};

function Layout() {
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
        <div style={{ flex: 1, padding: '36px 40px' }}>
          <Routes>
            <Route path="/"             element={<Dashboard />}     />
            <Route path="/portfolio"    element={<PortfolioPage />} />
            <Route path="/blog"         element={<BlogPage />}      />
            <Route path="/services"     element={<ServicesPage />}  />
            <Route path="/experience"   element={<ExperiencePage />}/>
            <Route path="/education"    element={<EducationPage />} />
            <Route path="/advantages"   element={<AdvantagesPage />}/>
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contacts"     element={<ContactsPage />}  />
            <Route path="/comments"     element={<CommentsPage />}  />
            <Route path="/settings"     element={<SettingsPage />}  />
            <Route path="*"             element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
