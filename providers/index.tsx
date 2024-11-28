// providers/index.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactQueryProvider from '@/lib/ReactQueryProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </QueryClientProvider>
  );
}