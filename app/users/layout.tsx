import Layout from '@/components/layout/Layout';

const UserLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default UserLayout;