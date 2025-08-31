import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getBranchBySlug, getDepartmentBySlug } from '@/data/departments';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function BranchPage() {
  const { departmentSlug, branchSlug } = useParams<{ departmentSlug: string; branchSlug: string }>();
  const navigate = useNavigate();
  
  const department = getDepartmentBySlug(departmentSlug || '');
  const branch = getBranchBySlug(departmentSlug || '', branchSlug || '');

  if (!department || !branch) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Branch Not Found</h1>
          <p className="mb-8">The branch you're looking for doesn't exist.</p>
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
          onClick={() => navigate(`/departments/${department.slug}`)}
        >
          <ChevronLeft className="h-4 w-4" /> Back to {department.name}
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">{branch.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{branch.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branch.subjects.map((subject) => (
            <Link 
              key={subject.id} 
              to={`/departments/${department.slug}/branches/${branch.slug}/subjects/${subject.slug}`}
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {subject.notes.length} {subject.notes.length === 1 ? 'note' : 'notes'} available
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {branch.subjects.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xl text-muted-foreground">No subjects available for this branch yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}