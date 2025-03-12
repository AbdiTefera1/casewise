import Layout from '@/components/layout/Layout';

const DocumentLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default DocumentLayout;