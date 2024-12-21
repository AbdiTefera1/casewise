import Layout from '@/components/layout/Layout';

const LawyersLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default LawyersLayout;