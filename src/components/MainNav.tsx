import { Link } from 'react-router-dom';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export function MainNav() {
  const { isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-6 md:gap-10">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            NoteIt!
          </span>
        </Link>
        <nav className="flex gap-6">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Departments
          </Link>
          {isAdmin() && (
            <Link
              to="/admin"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}