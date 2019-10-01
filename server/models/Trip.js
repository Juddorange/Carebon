const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema(
  {
    departure: String,
    arrival: String,
    transport: String,
    duration: String,
    carbon: Number,
    distance: Number,
    returnTrip: { type: String, enum: ['RETURN TRIP', 'ONE WAY'] },
    frequency: {
      number: Number,
      period: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip
