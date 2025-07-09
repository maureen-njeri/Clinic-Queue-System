// lib/actions.ts

export async function updateStatus(id: string, newStatus: string) {
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) {
      throw new Error('Failed to update status')
    }

    return await res.json()
  } catch (err) {
    console.error('updateStatus error:', err)
    throw err
  }
}
