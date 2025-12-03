"use client";

import { useState, useRef } from "react";
import NextImage from "next/image";
import { useUploadDocument } from "@/hooks/useDocuments";
import { useCases } from "@/hooks/useCases";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, FileText, Image as ImageIcon, Package } from "lucide-react";
import { DocumentCategory } from "@/lib/api/documents";

export default function UploadDocumentPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocument = useUploadDocument();
  const { data: casesData } = useCases({ limit: 100 });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as DocumentCategory,
    caseId: '',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.caseId) return;

    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        ...formData,
        organizationId: casesData?.cases[0]?.organizationId || '',
      });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setFormData({
        title: '',
        description: '',
        category: '' as DocumentCategory,
        caseId: '',
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-gray-400" />;
    if (selectedFile.type.startsWith('image/')) return <ImageIcon className="w-12 h-12 text-blue-500" />;
    if (selectedFile.type.includes('pdf')) return <FileText className="w-12 h-12 text-red-500" />;
    return <File className="w-12 h-12 text-gray-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold mb-6">Upload Document</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFile ? 'file' : 'no-file'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                {getFileIcon()}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">
                      Drag and drop your file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports: PDF, DOC, DOCX, JPG, PNG (up to 10MB)
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex justify-center"
              >
                <div className="relative h-48 w-48">
                  <NextImage
                    src={preview}
                    alt="Selected file preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="CORRESPONDENCE">CORRESPONDENCE</option>
                <option value="PLEADING">PLEADING</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Case
              </label>
              <select
                value={formData.caseId}
                onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select case</option>
                {casesData?.cases.map(case_ => (
                  <option key={case_.id} value={case_.id}>
                    {case_.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!selectedFile || uploadDocument.isPending}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium
              ${!selectedFile || uploadDocument.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploadDocument.isPending ? (
              <span className="flex items-center justify-center">
                <Package className="w-5 h-5 animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}