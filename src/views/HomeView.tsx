import React, { useState, useEffect } from 'react';
import TotalBalance from '../components/TotalBalance';
import QuickActions from '../components/QuickActions';
import UserProfileOverview from '../components/UserProfileOverview';
import WalletOverview from '../components/WalletOverview';
import AccountsView from '../components/Accounts';
import DepositModal from '../components/modals/DepositModal';
import WithdrawModal from '../components/modals/WithdrawModal';
import TransferModal from '../components/modals/TransferModal';
import StateDisplay from '../components/StateDisplay';
import UploadDocumentModal from '../components/modals/UploadDocumentModal';

function HomeView() {
  const [balance, setBalance] = useState<number>(0);
  const [user, setUser] = useState<{ firstName: string; lastName: string; username: string; email: string }>({ firstName: '', lastName: '', username: '', email: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean>(true);

  // State for modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get the user data from local storage
        const storedUser = localStorage.getItem('userInfo');
        const storedUserData = storedUser ? JSON.parse(storedUser) : null;

        if (storedUserData) {
          setUser({
            firstName: storedUserData.firstName,
            lastName: storedUserData.lastName,
            username: storedUserData.firstName,
            email: storedUserData.email,
          });
        }

        // Fetch wallet balance from the API
        const balanceResponse = await fetch('http://localhost:3000/api/wallet/balance', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setBalance(balanceData.balance);
          setHasWallet(true); // Wallet exists
        } else {
          const errorData = await balanceResponse.json();
          if (errorData.error === "Wallet not found") {
            setBalance(0); // Set balance to 0 if wallet is not found
            setHasWallet(false); // No wallet found
          } else {
            throw new Error(errorData.error || 'Failed to fetch balance');
          }
        }

        // Fetch KYC status from the API
        const kycResponse = await fetch('http://localhost:3000/api/kyc/status', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });

        if (!kycResponse.ok) {
          const errorData = await kycResponse.json();
          throw new Error(errorData.error || 'Failed to fetch KYC status');
        }

        const kycData = await kycResponse.json();
        setKycStatus(kycData.status);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
        console.error("Error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendMoney = (amount: number) => {
    if (amount > 0 && amount <= balance) {
      setBalance((prevBalance) => prevBalance - amount);
      setSuccessMessage(`$${amount} sent successfully!`);
    } else {
      setError("Invalid amount or insufficient funds.");
    }
  };

  const handleRequestMoney = () => {
    const amount = parseFloat(prompt("Enter amount to request:") || '0');
    if (amount > 0) {
      setSuccessMessage(`Request for $${amount} sent successfully!`);
    } else {
      setError("Invalid amount.");
    }
  };

  const handleAddFunds = (amount: number) => {
    if (amount > 0) {
      setBalance((prevBalance) => prevBalance + amount);
      setSuccessMessage(`$${amount} added successfully!`);
    } else {
      setError("Invalid amount.");
    }
  };

  const handleUploadDocument = async (documentType: string, file: File) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch('http://localhost:3000/api/kyc/upload-document', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      const data = await response.json();
      console.log('Document uploaded:', data);
      setIsUploadOpen(false);
      setKycStatus('approved'); // Assume KYC is auto-approved
    } catch (error) {
      console.error('Failed to upload document:', error);
      setError('Failed to upload document');
    }
  };

  if (error === 'KYC verification not found' || kycStatus === 'pending') {
    return (
      <>
        <StateDisplay
          iconSrc="/assets/pending.svg"
          title={kycStatus === 'pending' ? 'KYC Pending' : 'KYC Not Found'}
          message={
            kycStatus === 'pending'
              ? 'Your account is still waiting for KYC approval. Please check back later.'
              : 'Your KYC information could not be found. Please complete the KYC process or contact support.'
          }
          showButton={true}
          buttonText="Upload Document"
          onButtonClick={() => setIsUploadOpen(true)}
        />
        <UploadDocumentModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUploadDocument}
        />
      </>
    );
  }

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
      {/* Display error, success messages, and wallet-related alerts */}
      {!hasWallet && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          You do not have a wallet yet. Please create a wallet to start managing your transactions.
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <UserProfileOverview userName={`${user.firstName} ${user.lastName}`} userEmail={user.email} />
        {hasWallet && <TotalBalance balance={balance} />}
        {hasWallet && (
          <>
            <QuickActions
              onSendMoney={() => setIsTransferOpen(true)}
              onRequestMoney={() => setIsWithdrawOpen(true)}
              onAddFunds={() => setIsDepositOpen(true)}
            />
            <WalletOverview />
          </>
        )}
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
