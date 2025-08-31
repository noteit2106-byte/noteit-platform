import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

const PDFViewer = ({ fileUrl, fileName }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  
  // Initialize PDF.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    if (!numPages) return;
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      if (newPage > 0 && newPage <= numPages) {
        return newPage;
      }
      return prevPageNumber;
    });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl border rounded-lg overflow-hidden shadow-sm">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center p-10">
              <p>Loading PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center p-10">
              <p className="text-red-500">Error loading PDF. Please try again.</p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center"
              >
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </a>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="pdf-page"
            width={window.innerWidth > 768 ? 600 : 300}
          />
        </Document>
      </div>
      
      {numPages && numPages > 1 && (
        <div className="flex items-center justify-between mt-4 w-full max-w-md">
          <Button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <p className="text-sm">
            Page {pageNumber} of {numPages}
          </p>
          <Button
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 0)}
            variant="outline"
            size="sm"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        download={fileName}
        className="mt-4"
      >
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </a>
    </div>
  );
};

export default PDFViewer;