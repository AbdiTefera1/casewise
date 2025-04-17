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

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useState } from 'react';

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
}

export const PdfViewer = ({ fileUrl, className }: PdfViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className={className}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 rounded hover:bg-red-200 text-red-800"
            >
              Reload Viewer
            </button>
          </div>
        ) : (
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            // onError={(err) => {
            //   console.error('PDF load error:', err);
            //   setError('Failed to load PDF document. Please try again.');
            // }}
            renderError={() => (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Failed to load document</div>
              </div>
            )}
            renderLoader={() => (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">Loading document...</div>
              </div>
            )}
          />
        )}
      </Worker>
    </div>
  );
};