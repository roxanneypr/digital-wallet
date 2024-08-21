import React, { useState, useEffect } from 'react';
import TotalBalance from '../components/TotalBalance';
import QuickActions from '../components/QuickActions';
import UserProfileOverview from '../components/UserProfileOverview';
import WalletOverview from '../components/WalletOverview';
import AccountsView from '../components/Accounts';
import DepositModal from '../components/modals/DepositModal';
import WithdrawModal from '../components/modals/WithdrawModal';
import TransferModal from '../components/modals/TransferModal';

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

  // State for modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching data from an API or other data sources
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate a delay for fetching data
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

  const handleSendMoney = (amount: number) => {
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

  const handleAddFunds = (amount: number) => {
    if (amount > 0) {
      setBalance((prevBalance) => prevBalance + amount);
      alert(`$${amount} added successfully!`);
    } else {
      alert("Invalid amount.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <img
          src="/assets/loading.svg"
          alt="Loading..."
          className="w-16 h-16"
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <UserProfileOverview userName={user.name} userEmail={user.email} />
        <TotalBalance balance={balance} />
        <QuickActions
          onSendMoney={() => setIsTransferOpen(true)}
          onRequestMoney={() => setIsWithdrawOpen(true)}
          onAddFunds={() => setIsDepositOpen(true)}
        />
        <WalletOverview />
        <AccountsView />
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleAddFunds}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={handleRequestMoney}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransfer={(amount, recipient) => handleSendMoney(amount)}
      />
    </>
  );
}

export default HomeView;
