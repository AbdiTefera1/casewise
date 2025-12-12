import Layout from '@/components/layout/Layout';

const ProfileLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default ProfileLayout;