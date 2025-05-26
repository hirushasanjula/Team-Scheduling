'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManageCompanyForm({ company }) {
  const [formData, setFormData] = useState({
    name: company.name || '',
    email: company.email || '',
    timezone: company.settings?.timezone || 'UTC',
    workingHoursStart: company.settings?.workingHours?.start || '09:00',
    workingHoursEnd: company.settings?.workingHours?.end || '17:00',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const validateForm = () => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      return 'Please enter a valid email';
    }
    if (!/^\d{2}:\d{2}$/.test(formData.workingHoursStart) || !/^\d{2}:\d{2}$/.test(formData.workingHoursEnd)) {
      return 'Please enter valid time formats (e.g., 09:00)';
    }
    return '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company._id, ...formData }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update company');
      }

      setSuccess('Company details updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">Company Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          name="timezone"
          value={formData.timezone}
          onValueChange={(value) => handleSelectChange('timezone', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="workingHoursStart">Working Hours Start</Label>
        <Input
          id="workingHoursStart"
          name="workingHoursStart"
          type="time"
          value={formData.workingHoursStart}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="workingHoursEnd">Working Hours End</Label>
        <Input
          id="workingHoursEnd"
          name="workingHoursEnd"
          type="time"
          value={formData.workingHoursEnd}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Company'}
      </Button>
    </form>
  );
}