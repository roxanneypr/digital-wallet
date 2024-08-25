import React, { useState } from 'react';
import { CreditCard, QrCode, X, CheckCircle } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  distance: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
}

const StorePurchase: React.FC = () => {
  const [scanningMode, setScanningMode] = useState<'store' | 'item' | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [paymentMethodId, setPaymentMethodId] = useState<string>(''); // Store payment method ID
  const [qrCodeData, setQrCodeData] = useState<string | null>(null); // Store QR Code data
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Simulated database of QR codes
  const qrCodes: { [key: string]: Store | Item } = {
    store123: { id: 1, name: 'Grocery Store', distance: '0.5 miles' },
    store456: { id: 2, name: 'Electronics Shop', distance: '1.2 miles' },
    item789: { id: 1, name: 'Milk', price: 3.99 },
    itemABC: { id: 2, name: 'Bread', price: 2.49 },
  };

  const startScanning = (mode: 'store' | 'item') => {
    setScanningMode(mode);
  };

  const handleScan = (qrCode: string) => {
    if (scanningMode === 'store') {
      const store = qrCodes[qrCode] as Store;
      if (store) {
        setSelectedStore(store);
        setScanningMode(null);
      } else {
        alert('Invalid store QR code');
      }
    } else if (scanningMode === 'item') {
      const item = qrCodes[qrCode] as Item;
      if (item) {
        addToCart(item);
        setScanningMode(null);
      } else {
        alert('Invalid item QR code');
      }
    }
  };

  const addToCart = (item: Item) => {
    setCart([...cart, item]);
    setTotal(total + item.price);
  };

  const removeFromCart = (item: Item) => {
    const newCart = cart.filter((i) => i.id !== item.id);
    setCart(newCart);
    setTotal(total - item.price);
  };

  const generateQrCode = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:3000/api/wallet/generate-qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR payment');
      }

      const { qrCodeDataURL, paymentId } = await response.json();
      setQrCodeData(qrCodeDataURL);
      console.log(`Generated QR code for payment ID: ${paymentId}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to generate QR code: ${error.message}`);
      } else {
        alert('Failed to generate QR code due to an unknown error');
      }
    }
  };

  const processPayment = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!qrCodeData) {
        alert('Please generate a QR code first.');
        return;
      }

      // Here you would typically call an API to record the transaction
      alert(`Payment of $${total.toFixed(2)} processed successfully!`);
      setCart([]);
      setTotal(0);
      setSelectedStore(null);
      setQrCodeData(null); // Clear the QR code after successful payment
      setPaymentCompleted(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Payment failed: ${error.message}`);
      } else {
        alert('Payment failed due to an unknown error');
      }
    }
  };

  const QRScanner: React.FC<{ onScan: (qrCode: string) => void }> = ({ onScan }) => (
    <div className="bg-gray-200 p-4 rounded-lg text-center">
      <p className="mb-2">Scanning QR Code...</p>
      <input
        type="text"
        placeholder="Enter QR code"
        className="p-2 border rounded"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onScan((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = '';
          }
        }}
      />
      <p className="mt-2 text-sm text-gray-600">(In a real app, this would use the device's camera)</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {!selectedStore ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Store</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {scanningMode === 'store' ? (
              <QRScanner onScan={handleScan} />
            ) : (
              <button
                onClick={() => startScanning('store')}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <QrCode size={18} className="mr-2" />
                Scan Store QR Code
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedStore.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{selectedStore.distance}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Scan Items</h4>
                {scanningMode === 'item' ? (
                  <QRScanner onScan={handleScan} />
                ) : (
                  <button
                    onClick={() => startScanning('item')}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <QrCode size={18} className="mr-2" />
                    Scan Item QR Code
                  </button>
                )}
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Your Cart</h4>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name} - ${item.price.toFixed(2)}</p>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">Total: ${total.toFixed(2)}</p>
                  {qrCodeData ? (
                    <div className="mt-4">
                      <img src={qrCodeData} alt="QR Code" className="mx-auto" />
                      <p className="text-center text-green-600 mt-2">Scan the QR code above to complete the payment.</p>
                    </div>
                  ) : (
                    <button
                      onClick={generateQrCode}
                      className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <QrCode size={18} className="mr-2" />
                      Generate QR Code
                    </button>
                  )}
                </div>
              </div>
            </div>
            {paymentCompleted && (
              <div className="mt-4 text-center text-green-600">
                <CheckCircle size={24} className="inline-block mr-2" />
                Payment Completed Successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePurchase;
