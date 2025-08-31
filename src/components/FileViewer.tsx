import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { useEffect, lazy, Suspense } from 'react';

// Dynamically import react-pdf components only when needed
const PDFViewer = lazy(() => import('./PDFViewer'));

type FileViewerProps = {
  fileType: 'markdown' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'image' | 'other';
  fileUrl?: string;
  fileName: string;
  fileExtension?: string;
};

export const FileViewer = ({ fileType, fileUrl, fileName, fileExtension }: FileViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // These functions are now handled in the PDFViewer component

  const renderFileViewer = () => {
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No file URL provided</p>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        return (
          <Suspense fallback={
            <div className="flex justify-center items-center p-10 border rounded-lg">
              <p>Loading PDF viewer...</p>
            </div>
          }>
            {fileUrl && <PDFViewer fileUrl={fileUrl} fileName={fileName} />}
          </Suspense>
        );
        
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <div className="border rounded-lg overflow-hidden shadow-sm max-w-3xl">
              <img 
                src={fileUrl} 
                alt={fileName} 
                className="max-w-full h-auto object-contain"
              />
            </div>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              download={fileName}
              className="mt-4"
            >
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </a>
          </div>
        );
        
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
      case 'other':
      default:
        return (
          <div className="flex flex-col items-center justify-center p-10 border rounded-lg">
            <div className="text-center">
              <FileText className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{fileName}</h3>
              <p className="text-muted-foreground mb-6">
                {fileType === 'doc' || fileType === 'docx' ? 'Word Document' : 
                 fileType === 'ppt' || fileType === 'pptx' ? 'PowerPoint Presentation' : 
                 fileExtension ? `${fileExtension.toUpperCase()} File` : 'Document'}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                This file type cannot be previewed directly. Please download to view.
              </p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download={fileName}
              >
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full py-4">
      {renderFileViewer()}
    </div>
  );
};