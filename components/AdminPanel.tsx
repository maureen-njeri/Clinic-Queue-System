'use client'

import NursePanel from './NursePanel'
import LabTechPanel from './LabTechPanel'
import PharmacistPanel from './PharmacistPanel'
import ReceptionistPanel from './ReceptionistPanel'

export default function AdminPanel() {
  return (
    <div className='space-y-8 p-4'>
      <section>
        <h2 className='text-2xl font-bold mb-2'>Nurse Panel</h2>
        <NursePanel />
      </section>

      <section>
        <h2 className='text-2xl font-bold mb-2'>Lab Technician Panel</h2>
        <LabTechPanel />
      </section>

      <section>
        <h2 className='text-2xl font-bold mb-2'>Pharmacist Panel</h2>
        <PharmacistPanel />
      </section>

      <section>
        <h2 className='text-2xl font-bold mb-2'>Receptionist Panel</h2>
        <ReceptionistPanel />
      </section>
    </div>
  )
}
