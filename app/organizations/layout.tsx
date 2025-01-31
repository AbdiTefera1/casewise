import Layout from '@/components/layout/Layout';

const OrganizationLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default OrganizationLayout;