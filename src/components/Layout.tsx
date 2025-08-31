import { ReactNode } from 'react';
import { MainNav } from './MainNav';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle, LogOut, Upload } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                  {isAdmin() && <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">Admin</span>}
                </div>
                
                {isAdmin() && (
                  <Link to="/admin/upload">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <Footer />
    </div>
  );
}