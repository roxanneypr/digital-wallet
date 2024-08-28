import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, Search } from 'lucide-react';
import DepositModal from '../components/modals/DepositModal';
import TransferModal from '../components/modals/TransferModal';
import WithdrawModal from '../components/modals/WithdrawModal';
import StateDisplay from '../components/StateDisplay';

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasWallet, setHasWallet] = useState(false);

  const userId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!).id : '';

  const checkWalletExists = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/balance', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.balance !== undefined) {
          setHasWallet(true);
          return true;
        } else {
          setHasWallet(false);
          return false;
        }
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Wallet not found') {
          setHasWallet(false);
          return false;
        } else {
          throw new Error(errorData.error || 'Failed to check wallet status');
        }
      }
    } catch (error) {
      console.error('Failed to check wallet:', error);
      setError('An error occurred while checking wallet.');
      return false;
    }
  };

  const fetchTransactions = async () => {
    try {
      const walletExists = await checkWalletExists();
      if (!walletExists) return; // Exit if wallet does not exist

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
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/deposit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, paymentMethodId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deposit funds');
      }

      setSuccessMessage('Deposit successful!');
      fetchTransactions(); // Refresh transactions after deposit
    } catch (error) {
      console.error('Deposit failed:', error);
      setError('Deposit failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleTransferMoney = async (amount: number, recipient: string) => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
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

      setSuccessMessage(`Transferred $${amount} to ${recipient} successfully!`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to transfer money:', error);
      setError('Transfer failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleWithdrawFunds = async (amount: number) => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
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

      setSuccessMessage(`Withdrew $${amount} successfully!`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
      setError('Withdrawal failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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
      {/* Transaction Buttons */}
      {hasWallet && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Transaction Buttons */}
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
                {filteredTransactions.map((transaction) => {
                  const isOutgoingTransfer = transaction.type === 'transfer' && transaction.fromWallet === userId;
                  return (
                    <tr key={transaction.id}>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900">
                        {transaction.type}
                      </td>
                      <td className={`px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-right font-medium ${isOutgoingTransfer ? 'text-red-600' : 'text-green-600'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

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
