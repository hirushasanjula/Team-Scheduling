import mongoose from 'mongoose'

const ShiftSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Shift title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime
      },
      message: 'End time must be after start time'
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigned user is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  }
}, {
  timestamps: true
})

ShiftSchema.index({ companyId: 1, startTime: 1 })
ShiftSchema.index({ assignedTo: 1, startTime: 1 })

export default mongoose.models.Shift || mongoose.model('Shift', ShiftSchema)