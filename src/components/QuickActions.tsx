import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface QuickActionsProps {
  onSendMoney: () => void;
  onRequestMoney: () => void;
  onAddFunds: () => void;
}

function QuickActions({ onSendMoney, onRequestMoney, onAddFunds }: QuickActionsProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button onClick={onSendMoney} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center">
            <ArrowUpRight className="mr-2" size={18} />
            Send Money
          </button>
          <button onClick={onRequestMoney} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center">
            <ArrowDownLeft className="mr-2" size={18} />
            Request Money
          </button>
          <button onClick={onAddFunds} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center">
            <Wallet className="mr-2" size={18} />
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
