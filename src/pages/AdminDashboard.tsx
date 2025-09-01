import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, BookOpen, Grid2X2, Users, Upload, Building, Trash2, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { AdminAnalytics } from '@/components/AdminAnalytics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [showNoteManager, setShowNoteManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Redirect non-admin users away from this page
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  // If not admin, don't render the dashboard
  if (!isAdmin()) {
    return null;
  }

  const adminModules = [
    {
      title: "Platform Analytics",
      description: "View comprehensive analytics and insights",
      icon: <BarChart3 className="h-8 w-8" />,
      action: () => setShowAnalytics(true),
      color: "bg-cyan-50 dark:bg-cyan-900/20"
    },
    {
      title: "Upload Notes",
      description: "Add new notes to the repository for students",
      icon: <Upload className="h-8 w-8" />,
      action: () => navigate('/admin/upload'),
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Manage Notes",
      description: "Search, view, and delete notes from the system",
      icon: <Trash2 className="h-8 w-8" />,
      action: () => setShowNoteManager(true),
      color: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Manage Departments",
      description: "Add, edit, or delete academic departments",
      icon: <Building className="h-8 w-8" />,
      action: () => navigate('/admin/departments'),
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Manage Branches",
      description: "Add, edit, or delete branches in departments",
      icon: <Grid2X2 className="h-8 w-8" />,
      action: () => navigate('/admin/branches'),
      color: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Manage Subjects",
      description: "Add, edit, or delete subjects in branches",
      icon: <BookOpen className="h-8 w-8" />,
      action: () => navigate('/admin/subjects'),
      color: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Admin Users",
      description: "Manage administrator access permissions",
      icon: <Users className="h-8 w-8" />,
      action: () => navigate('/admin/users'),
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.name}. Manage college notes platform resources from here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminModules.map((module, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className={`${module.color} p-4`}>
                <div className="flex items-center justify-center">
                  {module.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={module.action}
                >
                  {module.title === "Manage Notes" ? "Open Note Manager" : 
                   module.title === "Platform Analytics" ? "View Analytics" : "Manage"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Note Management Panel */}
        {showNoteManager && (
          <AdminPanel
            isVisible={showNoteManager}
            onToggleVisibility={() => setShowNoteManager(false)}
          />
        )}

        {/* Analytics Panel */}
        {showAnalytics && (
          <AdminAnalytics
            isVisible={showAnalytics}
            onToggleVisibility={() => setShowAnalytics(false)}
          />
        )}
      </div>
    </Layout>
  );
}