import Layout from '@/components/layout/Layout';

const SettingLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default SettingLayout;