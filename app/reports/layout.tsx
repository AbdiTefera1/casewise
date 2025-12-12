import Layout from '@/components/layout/Layout';

const ReportLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default ReportLayout;