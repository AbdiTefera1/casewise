export const useCases = (params?: Parameters<typeof lawyerApi.getLawyers>[0]) => {
return useQuery({
queryKey: ['cases', params],
queryFn: async () => {
const { cases, pagination } = await casesApi.getAll(params);
return { cases, pagination };
},
});
};

export const useClients = (params?: Parameters<typeof lawyerApi.getLawyers>[0]) => {
return useQuery({
queryKey: ['clients', params],
queryFn: () => clientsApi.getAll(params),
});
};

export function useLawyers(params?: Parameters<typeof lawyerApi.getLawyers>[0]) {
return useQuery({
queryKey: ['lawyers', params],
queryFn: () => lawyerApi.getLawyers(params),
});
}
