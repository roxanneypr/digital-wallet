// Dashboard.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeView from '../views/HomeView';
import TransactionsView from '../views/TransactionsView';
import NotificationsView from '../views/NotificationsView';
import ProfileView from '../views/ProfileView';
import SettingsView from '../views/SettingsView';
import AccountManagement from '../views/AccountManagementView';
import Layout from '../Layout';
import AccountsView from '../components/Accounts';
import QRPaymentsView from '../views/QRPaymentsView';

function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="home" element={<HomeView />} />
        <Route path="accounts" element={<AccountManagement />} />
        <Route path="transactions" element={<TransactionsView />} />
        <Route path="store-purchase" element={<QRPaymentsView />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="settings" element={<SettingsView />} />
      </Routes>
    </Layout>
  );
}

export default Dashboard;
