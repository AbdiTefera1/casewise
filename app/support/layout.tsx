import Layout from '@/components/layout/Layout';

const SupportLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default SupportLayout;