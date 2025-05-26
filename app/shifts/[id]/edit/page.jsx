import { auth } from '@/lib/auth';
  import { redirect } from 'next/navigation';
  import { connectDB } from '@/lib/db';
  import Shift from '@/models/Shift';
  import ShiftEditForm from '@/components/forms/ShiftEditForm';

  async function getShift(id) {
    await connectDB();
    const shift = await Shift.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .lean();
    return shift ? JSON.parse(JSON.stringify(shift)) : null;
  }

  export default async function EditShiftPage({ params }) {
    const session = await auth();
    
    if (!session) {
      redirect('/login');
    }
    
    if (session.user.role !== 'MANAGER') {
      redirect('/shifts');
    }
    
    try {
      const shift = await getShift(params.id);
      
      if (!shift) {
        redirect('/shifts');
      }
      
      if (shift.companyId !== session.user.companyId) {
        redirect('/shifts');
      }
      
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Shift</h1>
            <p className="text-gray-600">Update the shift details below.</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <ShiftEditForm shift={shift} />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error loading shift:', error);
      redirect('/shifts');
    }
  }