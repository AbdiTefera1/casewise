import Layout from '@/components/layout/Layout';

const DashboardLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default DashboardLayout;