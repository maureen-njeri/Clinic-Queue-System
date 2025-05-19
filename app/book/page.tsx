'use client';

import { useState } from 'react';

export default function BookAppointmentPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();
    setQueueNumber(data.queueNumber);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>

      {queueNumber && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <p>Your Queue Number is: <strong>{queueNumber}</strong></p>
        </div>
      )}
    </div>
  );
}
