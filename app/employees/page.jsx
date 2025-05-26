import { auth } from '@/lib/auth';
  import { redirect } from 'next/navigation';
  import { connectDB } from '@/lib/db';
  import User from '@/models/User';
  import Link from 'next/link';
  import { Button } from '@/components/ui/button';
  import DeleteEmployeeButton from '@/components/DeleteEmployeeButton';

  async function getEmployees(companyId) {
    await connectDB();
    const employees = await User.find({ companyId }).select('-password').lean();
    return JSON.parse(JSON.stringify(employees));
  }

  export default async function EmployeesPage() {
    const session = await auth();
    
    if (!session) {
      redirect('/login');
    }

    if (session.user.role !== 'MANAGER') {
      redirect('/dashboard');
    }

    const employees = await getEmployees(session.user.companyId);

    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <Link href="/employees/new">
            <Button>Add Employee</Button>
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <li key={employee._id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.role === 'MANAGER' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {employee.role}
                        </span>
                        {!employee.isActive && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      {employee.profile?.position && (
                        <p className="text-sm text-gray-500">
                          {employee.profile.position}
                          {employee.profile.department && ` • ${employee.profile.department}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/shifts?userId=${employee._id}`}>
                      <Button variant="outline" size="sm">
                        View Shifts
                      </Button>
                    </Link>
                    <Link href={`/employees/${employee._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteEmployeeButton 
                      employeeId={employee._id}
                      employeeName={employee.name}
                      companyId={session.user.companyId}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {employees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No employees found.</p>
              <Link href="/employees/new" className="mt-2 inline-block">
                <Button>Add your first employee</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }