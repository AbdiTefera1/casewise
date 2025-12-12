import Layout from '@/components/layout/Layout';

const NotificationLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default NotificationLayout;