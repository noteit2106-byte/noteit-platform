import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { departments } from '@/data/departments';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const { isAdmin } = useAuth();

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            College Study Notes
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Access comprehensive study materials organized by department
          </p>
        </div>

        {isAdmin() && (
          <div className="mb-8 flex justify-end">
            <Link to="/admin/upload">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Upload New Note</span>
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Link key={department.id} to={`/departments/${department.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={department.imageUrl}
                    alt={department.name}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{department.name}</CardTitle>
                  <CardDescription>{department.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {department.branches.length} {department.branches.length === 1 ? 'branch' : 'branches'} available
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}