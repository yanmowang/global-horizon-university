import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import CoursesPage from './components/CoursesPage';
// Import other components
import VerifyCertificate from './components/VerifyCertificate';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FaqPage from './components/FaqPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/user/UserDashboard';
import CertificateViewerPage from './components/user/CertificateViewerPage';
import KnowledgeBase from './components/KnowledgeBase';
import CommunityForum from './components/CommunityForum';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CertificateWall from './components/CertificateWall';
import NotFoundPage from './components/NotFoundPage';
import AdminDashboard from './components/admin/AdminDashboard';
import CertificateForm from './components/admin/CertificateForm';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import TestAuth from './components/TestAuth';

function App() {
  // 导航链接样式
  const activeClass = 'bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium';
  const inactiveClass =
    'text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium';

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/verify-certificate" element={<VerifyCertificate />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/community" element={<CommunityForum />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />e
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/test-auth" element={<TestAuth />} />

              {/* Protected User Routes */}
              <Route
                path="/user-dashboard/*"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate/:id"
                element={
                  <ProtectedRoute>
                    <CertificateViewerPage />
                  </ProtectedRoute>
                }
              />

              {/* 证书嵌入页面路由 */}
              <Route
                path="/certificate-embed/:id/:templateName"
                element={<CertificateViewerPage />}
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/certificates"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              
              {/* 证书管理路由 */}
              <Route
                path="/admin/certificates/new"
                element={
                  <ProtectedAdminRoute>
                    <CertificateForm />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/certificates/edit/:id"
                element={
                  <ProtectedAdminRoute>
                    <CertificateForm isEdit={true} />
                  </ProtectedAdminRoute>
                }
              />
              
              {/* Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
