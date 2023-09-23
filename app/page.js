'use client';

import DashboardLayout from '@/components/Dashboard/Layout';

function Home() {
  return <main></main>;
}

function DashboardHome() {
  return (
    <DashboardLayout>
      <Home />
    </DashboardLayout>
  );
}

export default DashboardHome;
