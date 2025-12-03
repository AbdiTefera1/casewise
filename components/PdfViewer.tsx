// "use client";

// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import { useState } from 'react';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// // pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
// interface PdfViewerProps {
//   fileUrl: string;
//   className?: string;
// }

// export const PdfViewer = ({ fileUrl, className }: PdfViewerProps) => {
//   const [numPages, setNumPages] = useState<number>();
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className={className}>
//       <Document
//         file={fileUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         loading={<div>Loading PDF...</div>}
//       >
//         <Page 
//           pageNumber={pageNumber} 
//           width={window.innerWidth * 0.8}
//           loading={<div>Loading page...</div>}
//         />
//       </Document>
      
//       <div className="flex items-center justify-center gap-4 p-4 bg-gray-50">
//         <button
//           onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
//           disabled={pageNumber <= 1}
//           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//         >
//           Previous
//         </button>
//         <span>
//           Page {pageNumber} of {numPages}
//         </span>
//         <button
//           onClick={() => setPageNumber(prev => Math.min(numPages || 1, prev + 1))}
//           disabled={pageNumber >= (numPages || 1)}
//           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };


// "use client";

// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import { useState } from 'react';

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// interface PdfViewerProps {
//   fileUrl: string;
//   className?: string;
// }

// export const PdfViewer = ({ fileUrl, className }: PdfViewerProps) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className={className}>
//       <Document
//         file={fileUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={(error) => console.error('PDF loading error:', error)}
//         loading={<div>Loading PDF...</div>}
//       >
//         <Page
//           pageNumber={pageNumber}
//           width={window.innerWidth * 0.8}
//           loading={<div>Loading page...</div>}
//         />
//       </Document>
//       {/* Rest of your pagination controls */}
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
}

export const PdfViewer = ({ fileUrl, className }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className={className}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        <Page pageNumber={pageNumber} width={800} loading={<div>Loading page...</div>} />
      </Document>

      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50">
        <button
          onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages ?? "?"}
        </span>
        <button
          onClick={() =>
            setPageNumber((prev) => Math.min(numPages ?? prev, prev + 1))
          }
          disabled={numPages !== null && pageNumber >= numPages}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};