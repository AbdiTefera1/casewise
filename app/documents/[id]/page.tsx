"use client"; // Required for hooks and interactivity

import { useDocument } from "@/hooks/useDocuments";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { use, useState } from "react";
import { FileIcon } from "lucide-react";
import { SecurePdfViewer } from "@/components/SecurePdfViewer";


export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: documentData, isLoading, error } = useDocument(id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  console.log("This view document: ", documentData);
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !documentData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Document Not Found</h2>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaArrowLeft />
          Back to Documents
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(documentData.document.storageUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", documentData.document.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to download file"
      );
    }
  };

  return (
    <div className={`p-6 ${isFullscreen ? "fixed inset-0 bg-white z-50" : ""}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <FaArrowLeft />
          Back to Documents
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaDownload />
            Download
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            {/* Add category icon here */}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {documentData.document.title}
            </h1>
            <p className="text-gray-500">{documentData.document.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span>Uploaded by:</span>
            <span className="font-medium">
              {documentData.document.uploadedBy.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Case:</span>
            <span className="font-medium">
              {documentData.document.case.caseNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Created:</span>
            <span className="font-medium">
              {new Date(documentData.document.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>File Type:</span>
            <span className="font-medium">
              {documentData.document.fileType}
            </span>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {documentData.document.fileType === "application/pdf" ? (
          <SecurePdfViewer
            fileUrl={documentData.document.downloadUrl}
            fileName={documentData.document.fileName}
            className="w-full h-[calc(100vh-180px)]"
          />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-300px)] border">
            <div className="text-center p-6 text-gray-500">
              <FileIcon className="w-12 h-12 mx-auto mb-4" />
              <p>Preview not available for {documentData?.document.fileType}</p>
              <a
                href={`/api/documents/download/${documentData?.document.storagePath}`}
                download
                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download File
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// "use client";

// import { useState, useMemo, useCallback } from 'react';
// import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaSortAmountDown, FaCalendarAlt, FaUser, FaBalanceScale, FaSpinner, FaDownload, FaEye } from 'react-icons/fa';
// import { useDocuments, useDownloadDocument } from '@/hooks/useDocuments';
// import { DocumentCategory } from '@/lib/api/documents';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import api from "@/lib/api/config";
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // Set up the worker for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const ListDocumentsPage = () => {
//   const [downloadingId, setDownloadingId] = useState<string | null>(null);
//   const [previewDoc, setPreviewDoc] = useState<{ id: string; fileName: string } | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const downloadDocumentMutation = useDownloadDocument();

//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 12,
//     search: '',
//     category: undefined as DocumentCategory | undefined,
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     sortBy: 'date' as 'date' | 'name' | 'size',
//     sortOrder: 'desc' as 'asc' | 'desc',
//   });

//   const { data, isLoading } = useDocuments(filters);

//   const handleDownload = useCallback(async (documentId: string, fileName: string) => {
//     try {
//       setDownloadingId(documentId);
//       await downloadDocumentMutation.mutateAsync(`/documents/${documentId}`, {
//         onSuccess: () => toast.success(`Downloading ${fileName}...`),
//         onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to download'),
//       });
//     } catch (error) {
//       toast.error('Download failed');
//     } finally {
//       setDownloadingId(null);
//     }
//   }, [downloadDocumentMutation]);

//   const handlePreview = (doc: { id: string; fileName: string }) => {
//     setPreviewDoc(doc);
//   };

//   const closePreview = () => {
//     setPreviewDoc(null);
//   };

//   const categoryIcons = useMemo(() => ({
//     [DocumentCategory.PLEADING]: <FaBalanceScale className="text-blue-500" />,
//     [DocumentCategory.EVIDENCE]: <FaFilePdf className="text-red-500" />,
//     [DocumentCategory.CORRESPONDENCE]: <FaFileWord className="text-green-500" />,
//     [DocumentCategory.CONTRACT]: <FaFileExcel className="text-purple-500" />,
//     [DocumentCategory.OTHER]: <FaFileImage className="text-yellow-500" />,
//   }), []);

//   const formatFileSize = (bytes: number) => {
//     const units = ['B', 'KB', 'MB', 'GB'];
//     let size = bytes;
//     let unitIndex = 0;
//     while (size >= 1024 && unitIndex < units.length - 1) {
//       size /= 1024;
//       unitIndex++;
//     }
//     return `${size.toFixed(1)} ${units[unitIndex]}`;
//   };

//   const fetchPdfUrl = useCallback(async (documentId: string) => {
//     try {
//       const response = await api.get(`/documents/${documentId}`, { responseType: "blob" });
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       return URL.createObjectURL(blob);
//     } catch (error) {
//       toast.error('Failed to load PDF preview');
//       console.error('PDF fetch error:', error);
//       return null;
//     }
//   }, []);

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-3xl font-bold tracking-tight">Document Repository</h1>
//         <Link href="/documents/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//           Upload Document
//         </Link>
//       </div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm p-6 sticky top-4 z-10"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search documents..."
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
//             />
//           </div>

//           <div className="relative">
//             <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <select
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.category || ''}
//               onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as DocumentCategory, page: 1 }))}
//             >
//               <option value="">All Categories</option>
//               {Object.values(DocumentCategory).map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div className="relative">
//               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//                 onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value), page: 1 }))}
//               />
//             </div>
//             <div className="relative">
//               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//                 onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value), page: 1 }))}
//               />
//             </div>
//           </div>

//           <div className="relative">
//             <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <select
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.sortBy}
//               onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
//             >
//               <option value="date">Sort by Date</option>
//               <option value="name">Sort by Name</option>
//               <option value="size">Sort by Size</option>
//             </select>
//           </div>
//         </div>
//       </motion.div>

//       {/* Documents Grid */}
//       <AnimatePresence>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {isLoading ? (
//             [...Array(filters.limit)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </motion.div>
//             ))
//           ) : data?.documents.map(document => (
//             <motion.div
//               key={document.id}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 group"
//             >
//               <div className="flex items-center justify-center bg-gray-50 rounded-lg h-48 mb-4 relative overflow-hidden">
//                 {categoryIcons[document.category as DocumentCategory]}
//                 <span className="absolute bottom-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-full">
//                   {document.category}
//                 </span>
//               </div>

//               <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
//                 {document.title}
//               </h3>
//               <p className="text-sm text-gray-500 line-clamp-2">{document.description}</p>

//               <div className="mt-3 space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <FaUser className="text-gray-400" />
//                   <span className="truncate">{document.uploadedBy.name}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaBalanceScale className="text-gray-400" />
//                   <span>{document.case.caseNumber}</span>
//                 </div>
//               </div>

//               <div className="mt-4 flex items-center justify-between">
//                 <button
//                   onClick={() => handleDownload(document.id, document.fileName)}
//                   disabled={downloadingId === document.id}
//                   className="flex items-center gap-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
//                 >
//                   {downloadingId === document.id ? (
//                     <FaSpinner className="animate-spin" />
//                   ) : (
//                     <FaDownload />
//                   )}
//                   <span>Download</span>
//                 </button>

//                 <button
//                   onClick={() => handlePreview({ id: document.id, fileName: document.fileName })}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                 >
//                   <FaEye />
//                 </button>

//                 <span className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</span>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </AnimatePresence>

//       {/* PDF Preview Modal */}
//       {previewDoc && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
//             <button
//               onClick={closePreview}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
//             >
//               ×
//             </button>
//             <h2 className="text-xl font-semibold mb-4">{previewDoc.fileName}</h2>
//             <div className="min-h-[600px] border border-gray-200 rounded-lg overflow-hidden">
//               <Document
//                 file={fetchPdfUrl(previewDoc.id)}
//                 onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                 loading={<div className="flex items-center justify-center h-full"><FaSpinner className="animate-spin text-blue-500 text-2xl" /></div>}
//                 error={<div className="flex items-center justify-center h-full text-red-500">Failed to load PDF</div>}
//               >
//                 {Array.from(new Array(numPages || 0), (_, index) => (
//                   <Page
//                     key={`page_${index + 1}`}
//                     pageNumber={index + 1}
//                     renderAnnotationLayer={true}
//                     renderTextLayer={true}
//                     className="mb-4"
//                   />
//                 ))}
//               </Document>
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => handleDownload(previewDoc.id, previewDoc.fileName)}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <FaDownload />
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {data?.pagination.totalPages > 1 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex justify-center mt-8"
//         >
//           <div className="flex gap-2">
//             {Array.from({ length: data.pagination.totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   filters.page === i + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ListDocumentsPage;




// "use client";

// import { useState, useMemo, useCallback, useEffect } from 'react';
// import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaSortAmountDown, FaCalendarAlt, FaUser, FaBalanceScale, FaSpinner, FaDownload, FaEye } from 'react-icons/fa';
// import { useDocuments, useDownloadDocument } from '@/hooks/useDocuments';
// import { DocumentCategory } from '@/lib/api/documents';
// import Link from 'next/link';
// import api from "@/lib/api/config";
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // Set up the worker for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const ListDocumentsPage = () => {
//   const [downloadingId, setDownloadingId] = useState<string | null>(null);
//   const [previewDoc, setPreviewDoc] = useState<{ id: string; fileName: string; downloadUrl?: string } | null>(null);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const downloadDocumentMutation = useDownloadDocument();

//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 12,
//     search: '',
//     category: undefined as DocumentCategory | undefined,
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     sortBy: 'date' as 'date' | 'name' | 'size',
//     sortOrder: 'desc' as 'asc' | 'desc',
//   });

//   const { data, isLoading: documentsLoading } = useDocuments(filters);

//   const getSafeUrl = useCallback((url: string) => {
//     const baseUrlPattern = new RegExp(`^${api.defaults.baseURL}|/api`);
//     return url.replace(baseUrlPattern, "").replace(/^\/+/, "");
//   }, []);

//   const handleDownload = useCallback(async (documentId: string, fileName: string, downloadUrl?: string) => {
//     try {
//       setDownloadingId(documentId);
//       if (!downloadUrl) throw new Error("Download URL is not available");
//       const safeUrl = getSafeUrl(downloadUrl);
//       const response = await api.get(safeUrl, { responseType: "blob" });
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
      
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       setTimeout(() => URL.revokeObjectURL(url), 100);
//       alert(`Downloading ${fileName}...`);
//     } catch (err) {
//       alert("Download failed. Please try again.");
//       console.error("Download error:", err);
//     } finally {
//       setDownloadingId(null);
//     }
//   }, [getSafeUrl]);

//   const handlePreview = (doc: { id: string; fileName: string; downloadUrl?: string }) => {
//     console.log("Previewing document:", doc); // Debug log
//     setPreviewDoc(doc);
//   };

//   const closePreview = () => {
//     setPreviewDoc(null);
//     setPdfUrl(null);
//     setError(null);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (!previewDoc || !previewDoc.downloadUrl) {
//       setError("No download URL available for this document");
//       setIsLoading(false);
//       return;
//     }

//     let blobUrl: string | null = null;
    
//     const fetchPdf = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const safeUrl = getSafeUrl(previewDoc.downloadUrl);
//         const response = await api.get(safeUrl, { responseType: "blob" });
//         const blob = new Blob([response.data], { type: "application/pdf" });
//         blobUrl = URL.createObjectURL(blob);
//         setPdfUrl(blobUrl);
//       } catch (err) {
//         setError("Failed to load PDF. The document may be unavailable.");
//         console.error("PDF fetch error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPdf();

//     return () => {
//       if (blobUrl) URL.revokeObjectURL(blobUrl);
//     };
//   }, [previewDoc, getSafeUrl]);

//   const categoryIcons = useMemo(() => ({
//     [DocumentCategory.PLEADING]: <FaBalanceScale className="text-blue-500" />,
//     [DocumentCategory.EVIDENCE]: <FaFilePdf className="text-red-500" />,
//     [DocumentCategory.CORRESPONDENCE]: <FaFileWord className="text-green-500" />,
//     [DocumentCategory.CONTRACT]: <FaFileExcel className="text-purple-500" />,
//     [DocumentCategory.OTHER]: <FaFileImage className="text-yellow-500" />,
//   }), []);

//   const formatFileSize = (bytes: number) => {
//     const units = ['B', 'KB', 'MB', 'GB'];
//     let size = bytes;
//     let unitIndex = 0;
//     while (size >= 1024 && unitIndex < units.length - 1) {
//       size /= 1024;
//       unitIndex++;
//     }
//     return `${size.toFixed(1)} ${units[unitIndex]}`;
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-3xl font-bold tracking-tight">Document Repository</h1>
//         <Link href="/documents/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//           Upload Document
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 z-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search documents..."
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
//             />
//           </div>

//           <div className="relative">
//             <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <select
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.category || ''}
//               onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as DocumentCategory, page: 1 }))}
//             >
//               <option value="">All Categories</option>
//               {Object.values(DocumentCategory).map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div className="relative">
//               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//                 onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value), page: 1 }))}
//               />
//             </div>
//             <div className="relative">
//               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//                 onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value), page: 1 }))}
//               />
//             </div>
//           </div>

//           <div className="relative">
//             <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <select
//               className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
//               value={filters.sortBy}
//               onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
//             >
//               <option value="date">Sort by Date</option>
//               <option value="name">Sort by Name</option>
//               <option value="size">Sort by Size</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Documents Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {documentsLoading ? (
//           [...Array(filters.limit)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
//             >
//               <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))
//         ) : data?.documents.map(document => (
//           <div
//             key={document.id}
//             className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 group"
//           >
//             <div className="flex items-center justify-center bg-gray-50 rounded-lg h-48 mb-4 relative overflow-hidden">
//               {categoryIcons[document.category as DocumentCategory]}
//               <span className="absolute bottom-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-full">
//                 {document.category}
//               </span>
//             </div>

//             <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
//               {document.title}
//             </h3>
//             <p className="text-sm text-gray-500 line-clamp-2">{document.description}</p>

//             <div className="mt-3 space-y-2 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <FaUser className="text-gray-400" />
//                 <span className="truncate">{document.uploadedBy.name}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaBalanceScale className="text-gray-400" />
//                 <span>{document.case.caseNumber}</span>
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <button
//                 onClick={() => handleDownload(document.id, document.fileName, document.downloadUrl)}
//                 disabled={downloadingId === document.id}
//                 className="flex items-center gap-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
//               >
//                 {downloadingId === document.id ? (
//                   <FaSpinner className="animate-spin" />
//                 ) : (
//                   <FaDownload />
//                 )}
//                 <span>Download</span>
//               </button>

//               <button
//                 onClick={() => handlePreview({ id: document.id, fileName: document.fileName, downloadUrl: document.downloadUrl })}
//                 className="text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 <FaEye />
//               </button>

//               <span className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PDF Preview Modal */}
//       {previewDoc && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
//             <button
//               onClick={closePreview}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
//             >
//               ×
//             </button>
//             <h2 className="text-xl font-semibold mb-4">{previewDoc.fileName}</h2>
//             <div className="min-h-[600px] border border-gray-200 rounded-lg overflow-hidden">
//               {isLoading ? (
//                 <div className="flex flex-col items-center justify-center h-full bg-gray-50">
//                   <FaSpinner className="animate-spin text-blue-500 text-2xl mb-3" />
//                   <p className="text-gray-600">Loading document...</p>
//                 </div>
//               ) : error || !pdfUrl ? (
//                 <div className="flex flex-col items-center justify-center h-full bg-red-50 rounded-lg p-6">
//                   <div className="flex items-center gap-2 mb-4">
//                     <FaFilePdf className="text-red-500 text-xl" />
//                     <h3 className="text-red-600 font-medium">{error || "Failed to load document"}</h3>
//                   </div>
//                   <button
//                     onClick={() => handleDownload(previewDoc.id, previewDoc.fileName, previewDoc.downloadUrl)}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                   >
//                     <FaDownload />
//                     Download PDF
//                   </button>
//                 </div>
//               ) : (
//                 <Document
//                   file={pdfUrl}
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   loading={<div className="flex items-center justify-center h-full"><FaSpinner className="animate-spin text-blue-500 text-2xl" /></div>}
//                   error={<div className="flex items-center justify-center h-full text-red-500">Failed to load PDF</div>}
//                 >
//                   {Array.from(new Array(numPages || 0), (_, index) => (
//                     <Page
//                       key={`page_${index + 1}`}
//                       pageNumber={index + 1}
//                       renderAnnotationLayer={true}
//                       renderTextLayer={true}
//                       className="mb-4"
//                     />
//                   ))}
//                 </Document>
//               )}
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => handleDownload(previewDoc.id, previewDoc.fileName, previewDoc.downloadUrl)}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <FaDownload />
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {data?.pagination.totalPages > 1 && (
//         <div className="flex justify-center mt-8">
//           <div className="flex gap-2">
//             {Array.from({ length: data.pagination.totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   filters.page === i + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListDocumentsPage;