// hooks/useDocuments.ts
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