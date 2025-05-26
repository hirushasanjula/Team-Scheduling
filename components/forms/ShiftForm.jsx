'use client'
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const ShiftForm = ({ onSuccess, shift = null }) => {
  const [formData, setFormData] = useState({
    title: shift?.title || '',
    startTime: shift?.startTime ? new Date(shift.startTime).toISOString().slice(0, 16) : '',
    endTime: shift?.endTime ? new Date(shift.endTime).toISOString().slice(0, 16) : '',
    assignedTo: shift?.assignedTo?._id || '',
    description: shift?.description || '',
    location: shift?.location || ''
  })
  const [employees, setEmployees] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.filter(user => user.role === 'EMPLOYEE'))
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validation
    const newErrors = {}
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const url = shift ? `/api/shifts/${shift._id}` : '/api/shifts'
      const method = shift ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString()
        })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess?.(data)
      } else {
        setErrors({ submit: data.error })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Shift Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        error={errors.title}
        placeholder="e.g., Morning Shift, Weekend Coverage"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Time"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          error={errors.startTime}
        />

        <Input
          label="End Time"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          error={errors.endTime}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Assign to Employee <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name} ({employee.email})
            </option>
          ))}
        </select>
        {errors.assignedTo && (
          <p className="text-sm text-red-600">{errors.assignedTo}</p>
        )}
      </div>

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        placeholder="e.g., Main Office, Remote, Store #1"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Additional details about this shift..."
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm">{errors.submit}</div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : (shift ? 'Update Shift' : 'Create Shift')}
        </Button>
      </div>
    </form>
  )
}

export default ShiftForm