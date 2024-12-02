import Layout from '@/components/layout/Layout';

const ClientLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default ClientLayout;