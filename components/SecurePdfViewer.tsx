// // components/SecurePdfViewer.tsx
// "use client";

// import { useState } from "react";

// interface SecurePdfViewerProps {
//   fileUrl: string;
//   className?: string;
//   fileName?: string;
// }

// export const SecurePdfViewer = ({ 
//   fileUrl, 
//   className,
//   fileName 
// }: SecurePdfViewerProps) => {
//   const [error, setError] = useState<string | null>(null);

//   // Handle both API routes and direct file paths
//   const getSafeUrl = (url: string) => {
//     if (url.startsWith('http') || url.startsWith('/api')) {
//       return url;
//     }
//     if (url.startsWith('C:\\')) {
//       const relativePath = url.split('uploads\\')[1];
//       return `/api/documents/file/${relativePath.replace(/\\/g, '/')}`;
//     }
//     return url;
//   };

//   const safeUrl = getSafeUrl(fileUrl);

//   return (
//     <div className={className}>
//       {error ? (
//         <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50">
//           <div className="text-red-600 mb-4">{error}</div>
//           <a
//             href={safeUrl}
//             download={fileName}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Download PDF
//           </a>
//         </div>
//       ) : (
//         <iframe 
//           src={safeUrl}
//           className="w-full h-full border-none"
//           title="PDF Viewer"
//           onError={() => setError('Failed to load PDF viewer')}
//         />
//       )}
//       <div className="p-2 bg-gray-100 text-center">
//         <a
//           href={safeUrl}
//           download={fileName}
//           className="text-blue-600 hover:text-blue-800 text-sm"
//         >
//           Download {fileName || 'PDF'}
//         </a>
//       </div>
//     </div>
//   );
// };



"use client";

import { useState, useEffect, useCallback } from "react";
import { FiDownload, FiAlertTriangle, FiLoader } from "react-icons/fi";
import api from "@/lib/api/config";

interface SecurePdfViewerProps {
  fileUrl: string;
  className?: string;
  fileName?: string;
}

export const SecurePdfViewer = ({
  fileUrl,
  className = "min-h-[500px]",
  fileName = "document.pdf",
}: SecurePdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized URL cleaner to prevent duplicate /api prefixes
  const getSafeUrl = useCallback((url: string) => {
    const baseUrlPattern = new RegExp(`^${api.defaults.baseURL}|/api`);
    return url.replace(baseUrlPattern, "").replace(/^\/+/, "");
  }, []);

  // Handle PDF download
  const handleDownload = useCallback(async () => {
    try {
      const safeUrl = getSafeUrl(fileUrl);
      const response = await api.get(safeUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("Download failed. Please try again.");
      console.error("Download error:", err);
    }
  }, [fileUrl, fileName, getSafeUrl]);

  // Fetch PDF when component mounts or fileUrl changes
  useEffect(() => {
    let blobUrl: string | null = null;
    
    const fetchPdf = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const safeUrl = getSafeUrl(fileUrl);
        const response = await api.get(safeUrl, { responseType: "blob" });
        const blob = new Blob([response.data], { type: "application/pdf" });
        blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
      } catch (err) {
        setError("Failed to load PDF. The document may be unavailable.");
        console.error("PDF fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fileUrl, getSafeUrl]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center ${className} bg-gray-50`}>
        <FiLoader className="animate-spin text-blue-500 text-2xl mb-3" />
        <p className="text-gray-600">Loading document...</p>
      </div>
    );
  }

  // Render error state
  if (error || !pdfUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className} bg-red-50 rounded-lg p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <FiAlertTriangle className="text-red-500 text-xl" />
          <h3 className="text-red-600 font-medium">{error || "Failed to load document"}</h3>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FiDownload />
          Download PDF
        </button>
      </div>
    );
  }

  // Render PDF viewer
  return (
    <div className={`flex flex-col ${className} border border-gray-200 rounded-lg overflow-hidden`}>
      <div className="flex-1">
        <iframe
          src={pdfUrl}
          className="w-full h-full min-h-[400px]"
          title={`PDF Viewer - ${fileName}`}
          onError={() => setError("Failed to load PDF viewer")}
        />
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-600 truncate">
          {fileName}
        </span>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiDownload size={14} />
          Download
        </button>
      </div>
    </div>
  );
};