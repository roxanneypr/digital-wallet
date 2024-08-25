import React, { useState } from 'react';
import { QrCode, CreditCard } from 'lucide-react';

function QRPaymentsView() {
  const [scanningMode, setScanningMode] = useState<'generate' | 'scan' | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');

  // Function to generate QR Code
  const generateQRCode = async () => {
    if (amount === null || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/generate-qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR code');
      }

      const data = await response.json();
      setQrCodeDataURL(data.qrCodeDataURL);
      setPaymentId(data.paymentId);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to generate QR code:', error.message);
      } else {
        console.error('Failed to generate QR code:', error);
      }
    }
  };

  // Function to handle scanning a QR Code
  const handleScanQRCode = async (qrCode: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/wallet/initiate-qr-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: qrCode, paymentMethodId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan QR code');
      }

      const data = await response.json();
      setAmount(data.amount);
      setRecipientId(data.recipientId);
      console.log('Payment initiated:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to scan QR code:', error.message);
      } else {
        console.error('Failed to scan QR code:', error);
      }
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/wallet/confirm-qr-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId: paymentId, paymentMethodId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm payment');
      }

      const data = await response.json();
      console.log('Payment confirmed:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to confirm payment:', error.message);
      } else {
        console.error('Failed to confirm payment:', error);
      }
    }
  };

  // Simulated QR code scanner
  const QRScanner = ({ onScan }: { onScan: (qrCode: string) => void }) => (
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
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount ?? ''}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={() => generateQRCode()}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <QrCode size={18} className="mr-2" />
            Generate QR Code
          </button>
        </div>
        {qrCodeDataURL && (
          <div className="mb-4">
            <img src={qrCodeDataURL} alt="Generated QR Code" className="w-48 h-48" />
          </div>
        )}
        <div className="mb-4">
          <button
            onClick={() => setScanningMode('scan')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <QrCode size={18} className="mr-2" />
            Scan QR Code
          </button>
        </div>
      </div>

      {scanningMode === 'scan' && <QRScanner onScan={handleScanQRCode} />}

      {amount && recipientId && (
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">Payment Details</p>
          <p className="text-gray-700">Amount: ${amount.toFixed(2)}</p>
          <p className="text-gray-700">Recipient ID: {recipientId}</p>
          <input
            type="text"
            placeholder="Enter Payment Method ID"
            value={paymentMethodId}
            onChange={(e) => setPaymentMethodId(e.target.value)}
            className="mt-2 p-2 border rounded"
          />
          <button
            onClick={handleConfirmPayment}
            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CreditCard size={18} className="mr-2" />
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
}

export default QRPaymentsView;
