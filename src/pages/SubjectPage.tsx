import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getSubjectBySlug, getBranchBySlug, getDepartmentBySlug } from '@/data/departments';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Image, FileSpreadsheet, FileImage, FileSymlink, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SubjectPage() {
  const { departmentSlug, branchSlug, subjectSlug } = useParams<{
    departmentSlug: string;
    branchSlug: string;
    subjectSlug: string;
  }>();
  
  const navigate = useNavigate();
  
  const department = getDepartmentBySlug(departmentSlug || '');
  const branch = getBranchBySlug(departmentSlug || '', branchSlug || '');
  const subject = getSubjectBySlug(departmentSlug || '', branchSlug || '', subjectSlug || '');

  // Group notes by batch
  const groupedNotes = subject?.notes.reduce<Record<string, typeof subject.notes>>((acc, note) => {
    const batchKey = note.batch || 'No Batch';
    if (!acc[batchKey]) {
      acc[batchKey] = [];
    }
    acc[batchKey].push(note);
    return acc;
  }, {}) || {};

  // Sort batches by newest first
  const sortedBatchKeys = Object.keys(groupedNotes).sort((a, b) => {
    if (a === 'No Batch') return 1;
    if (b === 'No Batch') return -1;
    return b.localeCompare(a); // Sort in descending order
  });

  // Helper function to get icon for file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'markdown':
        return <FileText className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'doc':
      case 'docx':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'ppt':
      case 'pptx':
        return <FileSymlink className="h-5 w-5" />;
      case 'image':
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (!department || !branch || !subject) {
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
          onClick={() => navigate(`/departments/${department.slug}/branches/${branch.slug}`)}
        >
          <ChevronLeft className="h-4 w-4" /> Back to {branch.name}
        </Button>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold">{subject.name}</h1>
              <p className="mt-2 text-xl text-muted-foreground">{subject.description}</p>
            </div>
          </div>
        </div>

        {sortedBatchKeys.length > 0 ? (
          sortedBatchKeys.map((batchKey) => (
            <div key={batchKey} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {batchKey}
                </h2>
                <Badge variant="outline" className="text-sm">
                  {groupedNotes[batchKey].length} {groupedNotes[batchKey].length === 1 ? 'note' : 'notes'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {groupedNotes[batchKey].map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getFileIcon(note.fileType)}
                              {note.title}
                            </CardTitle>
                            <CardDescription className="mt-2">{note.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {note.isHandwritten && (
                            <Badge variant="outline" className="text-xs">Handwritten</Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {note.fileType.toUpperCase()}
                            {note.fileExtension ? ` (${note.fileExtension})` : ''}
                          </Badge>
                        </div>
                      </CardContent>
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
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-xl text-muted-foreground">No notes available for this subject yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}