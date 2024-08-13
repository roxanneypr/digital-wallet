import React, { useState } from 'react';
import { Search } from 'lucide-react';

function TransactionsView() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-07-01', description: 'Grocery Store', amount: -75.50 },
    { id: 2, date: '2023-07-02', description: 'Salary Deposit', amount: 3000 },
    { id: 3, date: '2023-07-03', description: 'Electric Bill', amount: -120 },
    { id: 4, date: '2023-07-04', description: 'Online Purchase', amount: -50.25 },
    { id: 5, date: '2023-07-05', description: 'Restaurant', amount: -45 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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
                <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                <td className={`px-2 py-4 sm:px-6 whitespace-nowrap text-sm text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsView;
