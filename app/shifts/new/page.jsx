'use client'
import { useRouter } from 'next/navigation'
import ShiftForm from '@/components/forms/ShiftForm'

export default function NewShiftPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/shifts')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Shift</h1>
        <p className="text-gray-600">Schedule a new shift for your employees.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ShiftForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}