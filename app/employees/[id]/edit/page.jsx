import { auth } from '@/lib/auth';
  import { redirect } from 'next/navigation';
  import { connectDB } from '@/lib/db';
  import User from '@/models/User';
  import EmployeeForm from '@/components/forms/EmployeeForm';

  async function getEmployee(id, companyId) {
    await connectDB();
    const employee = await User.findOne({ _id: id, companyId }).select('-password').lean();
    return employee ? JSON.parse(JSON.stringify(employee)) : null;
  }

  export default async function EditEmployeePage({ params }) {
    const session = await auth();
    
    if (!session) {
      redirect('/login');
    }

    if (session.user.role !== 'MANAGER') {
      redirect('/dashboard');
    }

    const employee = await getEmployee(params.id, session.user.companyId);
    
    if (!employee) {
      redirect('/employees');
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600">Update employee information</p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <EmployeeForm employee={employee} companyId={session.user.companyId} />
          </div>
        </div>
      </div>
    );
  }