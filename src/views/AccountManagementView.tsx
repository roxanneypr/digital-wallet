import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { PlusCircle, CreditCard, Building, Trash2 } from 'lucide-react';
import StateDisplay from '../components/StateDisplay';

interface Account {
  id: number;
  type: string;
  name: string;
  balance: number;
}

interface Bank {
  id: number;
  name: string;
  accountNumber: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  expiryDate: string;
}

function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, type: 'Checking', name: 'Main Checking', balance: 5000 },
    { id: 2, type: 'Savings', name: 'Emergency Fund', balance: 10000 },
  ]);

  const [linkedBanks, setLinkedBanks] = useState<Bank[]>([
    { id: 1, name: 'Bank of America', accountNumber: '****1234' },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: 'Credit Card', last4: '5678', expiryDate: '12/24' },
  ]);

  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountType, setNewAccountType] = useState<string>('Checking');
  const [newBankName, setNewBankName] = useState<string>('');
  const [newBankAccountNumber, setNewBankAccountNumber] = useState<string>('');
  const [newCardNumber, setNewCardNumber] = useState<string>('');
  const [newCardExpiry, setNewCardExpiry] = useState<string>('');
  const [newCardCVV, setNewCardCVV] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Simulate a data fetch with a timeout
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleAddAccount = (e: FormEvent) => {
    e.preventDefault();
    if (newAccountName) {
      setPending(true);
      setTimeout(() => {
        setAccounts([
          ...accounts,
          {
            id: accounts.length + 1,
            type: newAccountType,
            name: newAccountName,
            balance: 0,
          },
        ]);
        setNewAccountName('');
        setNewAccountType('Checking');
        setPending(false);
      }, 1500); // Simulate account creation delay
    }
  };

  const handleLinkBank = (e: FormEvent) => {
    e.preventDefault();
    if (newBankName && newBankAccountNumber) {
      setPending(true);
      setTimeout(() => {
        setLinkedBanks([
          ...linkedBanks,
          {
            id: linkedBanks.length + 1,
            name: newBankName,
            accountNumber: `****${newBankAccountNumber.slice(-4)}`,
          },
        ]);
        setNewBankName('');
        setNewBankAccountNumber('');
        setPending(false);
      }, 1500); // Simulate bank linking delay
    }
  };

  const handleAddPaymentMethod = (e: FormEvent) => {
    e.preventDefault();
    if (newCardNumber && newCardExpiry && newCardCVV) {
      setPending(true);
      setTimeout(() => {
        setPaymentMethods([
          ...paymentMethods,
          {
            id: paymentMethods.length + 1,
            type: 'Credit Card',
            last4: newCardNumber.slice(-4),
            expiryDate: newCardExpiry,
          },
        ]);
        setNewCardNumber('');
        setNewCardExpiry('');
        setNewCardCVV('');
        setPending(false);
      }, 1500); // Simulate payment method addition delay
    }
  };

  const handleRemoveAccount = (id: number) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleRemoveBank = (id: number) => {
    setLinkedBanks(linkedBanks.filter((bank) => bank.id !== id));
  };

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <img src="/assets/loading.svg" alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  if (pending) {
    return (
      <StateDisplay 
        iconSrc="/assets/pending.svg" 
        title="Pending Account" 
        message="Your account is still waiting for KYC approval." 
        altText="Pending" 
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Accounts Section */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Accounts</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <li key={account.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0c55e9] truncate">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.type}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ${account.balance.toFixed(2)}
                    </p>
                    <button onClick={() => handleRemoveAccount(account.id)} className="ml-2 text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <form onSubmit={handleAddAccount} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={newAccountName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAccountName(e.target.value)}
              placeholder="Account Name"
              className="flex-grow shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
            />
            <select
              value={newAccountType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewAccountType(e.target.value)}
              className="shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
            >
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0c55e9] hover:bg-[#0a4bcc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c55e9]"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Account
            </button>
          </form>
        </div>
      </div>

      {/* Linked Bank Accounts Section */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Linked Bank Accounts</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {linkedBanks.map((bank) => (
              <li key={bank.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0c55e9] truncate">{bank.name}</p>
                    <p className="text-sm text-gray-500">Account: {bank.accountNumber}</p>
                  </div>
                  <button onClick={() => handleRemoveBank(bank.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <form onSubmit={handleLinkBank} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={newBankName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBankName(e.target.value)}
              placeholder="Bank Name"
              className="flex-grow shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={newBankAccountNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBankAccountNumber(e.target.value)}
              placeholder="Account Number"
              className="flex-grow shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0c55e9] hover:bg-[#0a4bcc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c55e9]"
            >
              <Building size={18} className="mr-2" />
              Link Bank
            </button>
          </form>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Methods</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <li key={method.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0c55e9] truncate">
                      {method.type} ending in {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">Expires: {method.expiryDate}</p>
                  </div>
                  <button onClick={() => handleRemovePaymentMethod(method.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <form onSubmit={handleAddPaymentMethod} className="space-y-2">
            <input
              type="text"
              value={newCardNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardNumber(e.target.value)}
              placeholder="Card Number"
              className="w-full shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newCardExpiry}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="flex-grow shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={newCardCVV}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardCVV(e.target.value)}
                placeholder="CVV"
                className="flex-grow shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0c55e9] hover:bg-[#0a4bcc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c55e9]"
            >
              <CreditCard size={18} className="mr-2" />
              Add Payment Method
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
