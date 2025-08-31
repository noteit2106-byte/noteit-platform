import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSubjectBySlug } from '@/data/subjects';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Subject() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const subject = getSubjectBySlug(slug || '');

  if (!subject) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Subject Not Found</h1>
          <p className="mb-8">The subject you're looking for doesn't exist.</p>
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
          <ChevronLeft className="h-4 w-4" /> Back to Subjects
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">{subject.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{subject.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {subject.notes.map((note) => (
            <Link key={note.id} to={`/notes/${note.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm">View Note</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {subject.notes.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xl text-muted-foreground">No notes available for this subject yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}