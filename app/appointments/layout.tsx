import Layout from '@/components/layout/Layout';

const AppointmentLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Layout>{children}</Layout>
  )
}

export default AppointmentLayout;