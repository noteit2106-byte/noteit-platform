import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getDepartmentBySlug } from '@/data/departments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DepartmentPage() {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const navigate = useNavigate();
  const department = getDepartmentBySlug(departmentSlug || '');

  if (!department) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Department Not Found</h1>
          <p className="mb-8">The department you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4" /> Back to Departments
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">{department.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{department.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {department.branches.map((branch) => (
            <Link key={branch.id} to={`/departments/${department.slug}/branches/${branch.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={branch.imageUrl}
                    alt={branch.name}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{branch.name}</CardTitle>
                  <CardDescription>{branch.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {branch.subjects.length} {branch.subjects.length === 1 ? 'subject' : 'subjects'} available
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {department.branches.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xl text-muted-foreground">No branches available for this department yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}