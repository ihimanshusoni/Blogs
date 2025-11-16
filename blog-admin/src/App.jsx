import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import BlogsListPage from "./pages/BlogsListPage.jsx";
import BlogFormPage from "./pages/BlogFormPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import PublicBlogsPage from "./pages/PublicBlogsPage.jsx";
import PublicBlogDetailPage from "./pages/PublicBlogDetailPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/blogs" replace />;
  }
  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <PublicBlogsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <PublicLayout>
            <PublicBlogDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthenticated>
            <SignupPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogsListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/new"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
