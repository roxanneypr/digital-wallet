import React, { useState, useEffect } from 'react';
import TotalBalance from '../components/TotalBalance';
import QuickActions from '../components/QuickActions';
import UserProfileOverview from '../components/UserProfileOverview';
import WalletOverview from '../components/WalletOverview';

function HomeView() {
  // Initial data declaration (simulating backend data)
  const initialData = {
    user: {
      name: 'John Doe',
      email: 'johndoe@example.com',
    },
    balance: 5000,
  };

  const [balance, setBalance] = useState<number>(0);
  const [user, setUser] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data from an API or other data sources
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate a delay for fetching data
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // Set the state with the initial data
        setBalance(initialData.balance);
        setUser(initialData.user);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendMoney = () => {
    const amount = parseFloat(prompt("Enter amount to send:") || '0');
    if (amount > 0 && amount <= balance) {
      setBalance((prevBalance) => prevBalance - amount);
      alert(`$${amount} sent successfully!`);
    } else {
      alert("Invalid amount or insufficient funds.");
    }
  };

  const handleRequestMoney = () => {
    const amount = parseFloat(prompt("Enter amount to request:") || '0');
    if (amount > 0) {
      alert(`Request for $${amount} sent successfully!`);
    } else {
      alert("Invalid amount.");
    }
  };

  const handleAddFunds = () => {
    const amount = parseFloat(prompt("Enter amount to add:") || '0');
    if (amount > 0) {
      setBalance((prevBalance) => prevBalance + amount);
      alert(`$${amount} added successfully!`);
    } else {
      alert("Invalid amount.");
    }
  };

  if (loading) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </section>
    ); // Show loading state while data is being fetched
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <UserProfileOverview userName={user.name} userEmail={user.email} />
      <TotalBalance balance={balance} />
      <QuickActions onSendMoney={handleSendMoney} onRequestMoney={handleRequestMoney} onAddFunds={handleAddFunds} />
      <WalletOverview />
    </div>
  );
}

export default HomeView;
