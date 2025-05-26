import { auth } from '@/lib/auth';
  import { connectDB } from '@/lib/db';
  import Company from '@/models/Company';
  import ManageCompanyForm from '@/components/forms/ManageCompanyForm';
  import { redirect } from 'next/navigation';

  export default async function ManageCompanyPage() {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'MANAGER') {
      redirect('/login');
    }

    await connectDB();
    const company = await Company.findById(session.user.companyId).lean();

    if (!company) {
      return <div className="text-center text-red-500">Company not found.</div>;
    }

    const companyWithDefaults = {
      _id: company._id.toString(),
      name: company.name,
      email: company.email,
      settings: {
        timezone: company.settings?.timezone || 'UTC',
        workingHours: {
          start: company.settings?.workingHours?.start || '09:00',
          end: company.settings?.workingHours?.end || '17:00',
        },
      },
      createdAt: company.createdAt ? company.createdAt.toISOString() : null,
      updatedAt: company.updatedAt ? company.updatedAt.toISOString() : null,
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Company Details</h1>
        <ManageCompanyForm company={companyWithDefaults} />
      </div>
    );
  }