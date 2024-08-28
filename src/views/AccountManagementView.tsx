import React, { useState, useEffect } from 'react';
import { PlusCircle, CreditCard, Trash2 } from 'lucide-react';
import StateDisplay from '../components/StateDisplay';

interface Wallet {
  id: string;
  balance: number;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

function AccountManagement() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null); // Only one payment method
  const [newPaymentMethodId, setNewPaymentMethodId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const walletResponse = await fetch('http://localhost:3000/api/wallet/balance', {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });

        if (!walletResponse.ok) {
          const errorData = await walletResponse.json();
          if (errorData.error === "Wallet not found") {
            setWallet(null); // No wallet exists
          } else {
            throw new Error(`Failed to fetch wallet: ${errorData.error || walletResponse.status}`);
          }
        } else {
          const walletData = await walletResponse.json();
          setWallet(walletData);

          // Only fetch payment methods if the wallet exists
          if (walletData && walletData.id) {
            const paymentMethodsResponse = await fetch('http://localhost:3000/api/wallet/payment-methods', {
              method: 'GET',
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });

            if (!paymentMethodsResponse.ok) {
              throw new Error(`Failed to fetch payment methods: ${paymentMethodsResponse.status}`);
            }

            const paymentMethodsData = await paymentMethodsResponse.json();
            if (paymentMethodsData.length > 0) {
              setPaymentMethod(paymentMethodsData[0]); // Assume only one payment method is allowed
            }
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        if (!(error instanceof Error && error.message.includes("Wallet not found"))) {
          setError('Failed to fetch data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateWallet = async () => {
    setPending(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          initialBalance: 0, // Set an initial balance or prompt the user to input one
        }),
      });

      if (response.ok) {
        const walletData = await response.json();
        setWallet(walletData);
        setSuccessMessage('Wallet created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      setError('Failed to create wallet. Please try again later.');
    } finally {
      setPending(false);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (paymentMethod) {
      alert('You can only have one payment method.');
      return;
    }
  
    if (newPaymentMethodId) {
      setPending(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/wallet/add-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethodId: newPaymentMethodId,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add payment method: ${errorData.error || response.status}`);
        }
  
        const paymentMethodData = await response.json();
        setPaymentMethod(paymentMethodData);
        setSuccessMessage('Payment method added successfully!');
  
        // Clear the form input
        setNewPaymentMethodId('');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error adding payment method:', error.message);
          setError(`Failed to add payment method: ${error.message}`);
        } else {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setPending(false);
      }
    }
  };
  

  const handleRemovePaymentMethod = async () => {
    if (!paymentMethod) return;

    setPending(true);
    try {
      const response = await fetch(`http://localhost:3000/api/wallet/payment-methods/${paymentMethod.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setPaymentMethod(null); // Remove the payment method
        setSuccessMessage('Payment method removed successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error('Error removing payment method:', error);
      setError('Failed to remove payment method. Please try again later.');
    } finally {
      setPending(false);
    }
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
        title="Processing"
        message="Please wait while we process your request."
        altText="Pending"
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Display error or success messages */}
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

      {/* Wallet Section */}
      {wallet ? (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Wallet</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm font-medium text-[#0c55e9]">Balance: ${wallet.balance.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Create Your Wallet</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <button
              onClick={handleCreateWallet}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0c55e9] hover:bg-[#0a4bcc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c55e9]"
            >
              <PlusCircle size={18} className="mr-2" />
              Create Wallet
            </button>
          </div>
        </div>
      )}

      {/* Payment Method Section */}
      {wallet && (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Method</h3>
          </div>
          <div className="border-t border-gray-200">
            {paymentMethod ? (
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0c55e9] truncate">
                      {paymentMethod.type} ending in {paymentMethod.card?.last4 || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires: {paymentMethod.card?.expMonth}/{paymentMethod.card?.expYear}
                    </p>
                    <p className="text-sm text-gray-500">ID: {paymentMethod.id}</p>
                  </div>
                  <button
                    onClick={handleRemovePaymentMethod}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 sm:px-6">
                <form onSubmit={handleAddPaymentMethod} className="space-y-2">
                  <input
                    type="text"
                    value={newPaymentMethodId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPaymentMethodId(e.target.value)}
                    placeholder="Payment Method ID"
                    className="w-full shadow-sm focus:ring-[#0c55e9] focus:border-[#0c55e9] block sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0c55e9] hover:bg-[#0a4bcc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c55e9]"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Add Payment Method
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
