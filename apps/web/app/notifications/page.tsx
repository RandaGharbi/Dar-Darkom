'use client';

import React from 'react';
import AdminNotificationPanel from '@/components/AdminNotificationPanel';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <AdminNotificationPanel />
    </DashboardLayout>
  );
}
