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
