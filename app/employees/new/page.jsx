import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EmployeeForm from '@/components/forms/EmployeeForm'

export default async function NewEmployeePage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-600">Create a new employee account</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <EmployeeForm companyId={session.user.companyId} />
        </div>
      </div>
    </div>
  )
}