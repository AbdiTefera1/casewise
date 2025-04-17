// hooks/useDocuments.ts
"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {documentApi} from '@/lib/api/documents'

export function useDocuments(params?: Parameters<typeof documentApi.getDocuments>[0]) {
    return useQuery({
      queryKey: ['documents', params],
      queryFn: () => documentApi.getDocuments(params),
    });
  }
  
  export function useDocument(id: string) {
    return useQuery({
      queryKey: ['documents', id],
      queryFn: () => documentApi.getDocument(id),
      enabled: !!id,
    });
  }
  
  export function useCaseDocuments(caseId: string, params?: Parameters<typeof documentApi.getCaseDocuments>[1]) {
    return useQuery({
      queryKey: ['documents', 'case', caseId, params],
      queryFn: () => documentApi.getCaseDocuments(caseId, params),
      enabled: !!caseId,
    });
  }
  
  export function useUploadDocument() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: documentApi.uploadDocument,
      onSuccess: (newDocument) => {
        queryClient.invalidateQueries({queryKey: ['documents']});
        queryClient.invalidateQueries({queryKey: ['documents', 'case', newDocument.caseId]});
      },
    });
  }

  export function useDownloadDocument() {
    return useMutation({
      mutationFn: (filePath: string) => documentApi.downloadDocument(filePath),
      onSuccess: (data, filePath) => {
        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath.split('/').pop() || 'document');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      onError: () => {
        alert('Failed to download document');
      },
    });
  }
  
  export function useDeleteDocument() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: documentApi.deleteDocument,
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({queryKey: ['documents']});
        queryClient.removeQueries({queryKey: ['documents', deletedId]});
      },
    });
  }