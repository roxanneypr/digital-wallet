import React, { useState } from 'react';
import { QrCode } from 'lucide-react';

function QRPaymentsView() {
  const [scanningMode, setScanningMode] = useState<'generate' | 'scan' | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');

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
          Authorization: `Bearer ${token}`,
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

  const handleScanQRCode = async (qrCode: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/wallet/initiate-qr-payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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

      await transferMoney(data.amount, data.recipientId);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to scan QR code:', error.message);
      } else {
        console.error('Failed to scan QR code:', error);
      }
    }
  };

  const transferMoney = async (amount: number, recipientId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/wallet/transfer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: recipientId, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transfer money');
      }

      const data = await response.json();
      console.log('Money transferred:', data);
      alert(`Payment of $${amount.toFixed(2)} to recipient ${recipientId} was successful.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to transfer money:', error.message);
      } else {
        console.error('Failed to transfer money:', error);
      }
    }
  };

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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center">
        <div className="mb-4 w-full">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount ?? ''}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div className="mb-4 w-full">
          <button
            onClick={generateQRCode}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
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
        <div className="mb-4 w-full">
          <button
            onClick={() => setScanningMode('scan')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <QrCode size={18} className="mr-2" />
            Scan QR Code
          </button>
        </div>
      </div>

      {scanningMode === 'scan' && <QRScanner onScan={handleScanQRCode} />}
    </div>
  );
}

export default QRPaymentsView;
