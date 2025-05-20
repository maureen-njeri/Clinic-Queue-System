'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface Patient {
  name: string;
  phone: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  queueNumber: number;
  status: string;
}

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('appointments');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channel.bind('status-updated', (data: { id: string; status: string }) => {
      // Refresh appointments when status updates
      fetchAppointments();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // ... rest of your component (UI code)
}
