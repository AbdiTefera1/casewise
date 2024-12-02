import Layout from '@/components/layout/Layout';

const CaseLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default CaseLayout;