import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import DepartmentPage from './pages/DepartmentPage';
import BranchPage from './pages/BranchPage';
import SubjectPage from './pages/SubjectPage';
import NotePage from './pages/NotePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import AdminDepartments from './pages/AdminDepartments';
import AdminBranches from './pages/AdminBranches';
import AdminSubjects from './pages/AdminSubjects';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes (require authentication) */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/departments/:departmentSlug" element={
              <ProtectedRoute>
                <DepartmentPage />
              </ProtectedRoute>
            } />
            
            <Route path="/departments/:departmentSlug/branches/:branchSlug" element={
              <ProtectedRoute>
                <BranchPage />
              </ProtectedRoute>
            } />
            
            <Route path="/departments/:departmentSlug/branches/:branchSlug/subjects/:subjectSlug" element={
              <ProtectedRoute>
                <SubjectPage />
              </ProtectedRoute>
            } />
            
            <Route path="/notes/:noteId" element={
              <ProtectedRoute>
                <NotePage />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiresAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/upload" element={
              <ProtectedRoute requiresAdmin>
                <AdminUpload />
              </ProtectedRoute>
            } />

            <Route path="/admin/departments" element={
              <ProtectedRoute requiresAdmin>
                <AdminDepartments />
              </ProtectedRoute>
            } />

            <Route path="/admin/branches" element={
              <ProtectedRoute requiresAdmin>
                <AdminBranches />
              </ProtectedRoute>
            } />

            <Route path="/admin/subjects" element={
              <ProtectedRoute requiresAdmin>
                <AdminSubjects />
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute requiresAdmin>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;