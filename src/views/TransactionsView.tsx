import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, Search } from 'lucide-react';
import DepositModal from '../components/modals/DepositModal';
import TransferModal from '../components/modals/TransferModal';
import WithdrawModal from '../components/modals/WithdrawModal';
import StateDisplay from '../components/StateDisplay';
import UploadDocumentModal from '../components/modals/UploadDocumentModal';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  fromWallet?: string;
  toWallet: string;
  status: string;
  createdAt: string;
}

function TransactionsView() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/transactions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('An error occurred while fetching transactions.');
    }
  };

  const handleAddFunds = async (amount: number, paymentMethodId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, paymentMethodId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deposit funds');
      }
  
      const data = await response.json();
      console.log('Deposit successful:', data);
      // Update the transactions or balance as needed
    } catch (error) {
      if (error instanceof Error) {
        console.error('Deposit failed:', error.message);
      } else {
        console.error('Deposit failed:', error);
      }
    }
  };

  const handleTransferMoney = async (amount: number, recipient: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/transfer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: recipient, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transfer money');
      }

      console.log(`Transferred $${amount} to ${recipient}`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to transfer money:', error);
    }
  };

  const handleWithdrawFunds = async (amount: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to withdraw funds');
      }

      console.log(`Withdrew: $${amount}`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
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

      fetchKycStatus();
      setIsUploadOpen(false);
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
  };

  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/kyc/status', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch KYC status');
      }

      const data = await response.json();
      setKycStatus(data.status);
      console.log('KYC Status:', data);
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
      setError('An error occurred while fetching KYC status.');
    }
  };

  useEffect(() => {
    fetchKycStatus();
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)
  );

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

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Transaction Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <button
          onClick={() => setIsTransferOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
        >
          <ArrowUpRight className="mr-2" size={20} />
          Send Money
        </button>
        <button
          onClick={() => setIsWithdrawOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
        >
          <ArrowDownLeft className="mr-2" size={20} />
          Request Money
        </button>
        <button
          onClick={() => setIsDepositOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
        >
          <Wallet className="mr-2" size={20} />
          Add Funds
        </button>
      </div>
      {/* Search Bar */}
      <div className="flex items-center bg-white shadow rounded-lg p-2">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-grow outline-none text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow overflow-x-auto sm:overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-2 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900">
                  {transaction.type}
                </td>
                <td className={`px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleAddFunds}
      />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransfer={handleTransferMoney}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={handleWithdrawFunds}
      />
    </div>
  );
}

export default TransactionsView;
