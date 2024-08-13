import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

function AccountsView() {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking Account', balance: 2500, number: '****1234' },
    { id: 2, name: 'Savings Account', balance: 10000, number: '****5678' },
  ]);

  const handleAddAccount = () => {
    const name = prompt("Enter account name:");
    if (name) {
  
      setTimeout(() => {
        const newAccount = {
          id: accounts.length + 1,
          name,
          balance: 0,
          number: `****${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setAccounts([...accounts, newAccount]);
      }, 1500); // Simulate account creation
    }
  };

  return (
    <div className="space-y-6">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">${account.balance.toFixed(2)}</p>
            <p className="mt-1 text-sm text-gray-500">Account number: {account.number}</p>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddAccount}
        className="w-full bg-[#0c55e9] text-white py-2 px-4 rounded hover:bg-[#0a4bcc] transition duration-200 flex items-center justify-center"
      >
        <PlusCircle className="mr-2" size={18} />
        Add New Account
      </button> 
    </div>
  );
}

export default AccountsView;
