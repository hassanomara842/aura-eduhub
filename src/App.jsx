import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Scholarships from './pages/Scholarships';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ScholarshipProvider } from './context/ScholarshipContext';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ScholarshipProvider>
          <Router>
            <ScrollToTop />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"                   element={<Home />} />
                  <Route path="/about"              element={<About />} />
                  <Route path="/scholarships"       element={<Scholarships />} />
                  <Route path="/scholarships/:id"   element={<ScholarshipDetail />} />
                  <Route path="/services"           element={<Services />} />
                  <Route path="/contact"            element={<Contact />} />
                  <Route path="/admin/login"        element={<LoginPage />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ScholarshipProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
