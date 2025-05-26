import mongoose from 'mongoose'

const TimeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: [true, 'Shift is required']
  },
  clockIn: {
    type: Date,
    required: [true, 'Clock in time is required']
  },
  clockOut: {
    type: Date,
    validate: {
      validator: function(clockOut) {
        return !clockOut || clockOut > this.clockIn
      },
      message: 'Clock out time must be after clock in time'
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
})

TimeEntrySchema.pre('save', function(next) {
  if (this.clockIn && this.clockOut) {
    const hours = (this.clockOut - this.clockIn) / (1000 * 60 * 60)
    this.totalHours = Math.round(hours * 100) / 100
    this.status = 'COMPLETED'
  }
  next()
})

TimeEntrySchema.index({ userId: 1, createdAt: -1 })
TimeEntrySchema.index({ companyId: 1, createdAt: -1 })

export default mongoose.models.TimeEntry || mongoose.model('TimeEntry', TimeEntrySchema)