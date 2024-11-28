
// app/dashboard/page.tsx

import {Dashboard} from '@/components/Dashboard/Dashboard';
// import Layout from '@/components/layout/Layout';
import Layout from "@/components/layout/Layout";
// import ReactQueryProvider from '@/lib/ReactQueryProvider';

export default function DashboardPage() {
        return (
                <Layout>
                   <Dashboard />
                </Layout>
              );
}