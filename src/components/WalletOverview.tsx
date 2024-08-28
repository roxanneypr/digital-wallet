import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthProvider'; // Adjust the import path as needed

interface Transaction {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  fromWallet: string | null;
  toWallet: string | null;
  status: string;
}

function WalletOverview() {
  const { user, authToken } = useAuth(); // Get the user info from the auth context
  const [data, setData] = useState<{ name: string; balance: number }[]>([]);
  const userId = user?.id; // Extract the user ID

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/wallet/transactions', {
          method: 'GET',
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const transactions: Transaction[] = await response.json();

        // Sort transactions by date
        transactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        // Initialize the balance and the data array
        let currentBalance = 0;
        const processedData: { name: string; balance: number }[] = transactions.map((transaction) => {
          if (transaction.status === 'completed') {
            if (transaction.toWallet === userId) {
              // User received money
              currentBalance += transaction.amount;
            } else if (transaction.fromWallet === userId) {
              // User sent money
              currentBalance -= transaction.amount;
            }

            return {
              name: new Date(transaction.createdAt).toLocaleString(),
              balance: currentBalance,
            };
          }
          return null;
        }).filter((entry): entry is { name: string; balance: number } => entry !== null); // Filter out null values

        // Prepend the initial balance (start from 0)
        processedData.unshift({ name: 'Start', balance: 0 });

        setData(processedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, authToken]);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WalletOverview;
