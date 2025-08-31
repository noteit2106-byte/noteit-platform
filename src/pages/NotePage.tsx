import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getNoteById } from '@/data/departments';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, BookOpen, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileViewer } from '@/components/FileViewer';
import { Badge } from '@/components/ui/badge';

export default function NotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const noteData = getNoteById(noteId || '');

  useEffect(() => {
    // Scroll to top when note changes
    window.scrollTo(0, 0);
  }, [noteId]);

  if (!noteData) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Note Not Found</h1>
          <p className="mb-8">The note you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  const { note, subject, branch, department } = noteData;

  const renderNoteContent = () => {
    if (note.fileType === 'markdown') {
      return (
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      );
    } else {
      return (
        <FileViewer
          fileType={note.fileType}
          fileUrl={note.fileUrl}
          fileName={`${note.title}.${note.fileExtension || note.fileType}`}
          fileExtension={note.fileExtension}
        />
      );
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(`/departments/${department.slug}/branches/${branch.slug}/subjects/${subject.slug}`)}
        >
          <ChevronLeft className="h-4 w-4" /> Back to {subject.name}
        </Button>

        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            {note.batch && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Batch: {note.batch}
              </Badge>
            )}
            {note.isHandwritten && (
              <Badge variant="outline" className="text-xs">
                Handwritten
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {note.fileType.toUpperCase()}
              {note.fileExtension ? ` (${note.fileExtension})` : ''}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold">{note.title}</h1>
          <p className="text-muted-foreground">{note.description}</p>
          <div className="text-sm text-muted-foreground flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="mr-4">Subject: {subject.name}</span>
            <span>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {renderNoteContent()}
      </div>
    </Layout>
  );
}