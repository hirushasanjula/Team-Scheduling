'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

const EmployeeForm = ({ onSuccess, employee = null, companyId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    password: '',
    role: employee?.role || 'EMPLOYEE',
    position: employee?.profile?.position || '',
    department: employee?.profile?.department || '',
    phone: employee?.profile?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let url, method, payload;

      if (employee) {
        // Update existing employee
        url = '/api/users';
        method = 'PUT';
        payload = {
          id: employee._id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          companyId: companyId,
        };
        // Note: Password updates might need a separate endpoint
      } else {
        // Create new employee
        url = '/api/users';
        method = 'POST';
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyId: companyId,
        };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (onSuccess) {
          onSuccess(data);
        } else {
          router.push('/employees');
        }
      } else {
        setErrors({ submit: data.error });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
        </div>

        {!employee && (
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            />
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>
          <Input
            name="position"
            id="position"
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <Input
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm">{errors.submit}</div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? 'Saving...'
            : employee
            ? 'Update Employee'
            : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;